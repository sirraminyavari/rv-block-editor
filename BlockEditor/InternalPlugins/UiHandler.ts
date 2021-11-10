import { EditorState, SelectionState } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'

import * as NASM from 'BlockEditor/Lib/nestAwareSelectionModifier'
import blsAwareDelete from 'BlockEditor/Lib/blsAwareDelete'


/**
 * Provides some User Interface functionality and keyboard shortcuts.
 */
export default function createUiHandlerPlugin (): EditorPlugin {
    return ({ getUiContext }) => ({
        id: '__internal__ui-handler',

        keyBindingFn ( event ) {
            const { plusActionMenuInfo, blockLevelSelectionInfo } = getUiContext ()

            if ( event.ctrlKey && event.key === 'a' ) return 'select-all'

            // Block-Level Selection
            if ( blockLevelSelectionInfo.enabled ) {
                // Cancelation
                if (
                    event.key === 'Escape' ||
                    ( ! event.shiftKey && [ 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight' ].indexOf ( event.key ) >= 0 )
                ) return 'bls-disable'
                // Delete
                if ( [ 'Backspace', 'Delete' ].indexOf ( event.key ) >= 0 )
                    return 'bls-delete'
                // Verified Commands
                if ( event.ctrlKey && (
                    [ 'c', 'x', 'v', 'z', 'y' ].indexOf ( event.key ) >= 0 ||
                    ( event.shiftKey && event.key === 'z' )
                ) ) return undefined
                // Selection Modification
                if ( event.shiftKey ) {
                    if ( event.key === 'ArrowDown' )
                        return blockLevelSelectionInfo.selectedBlockKeys.length > 1
                            ? 'bls-goDown' : 'bls-goDown-singleBlock'
                    if ( event.key === 'ArrowUp' )
                        return blockLevelSelectionInfo.selectedBlockKeys.length > 1
                            ? 'bls-goUp' : 'bls-goUp-singleBlock'
                }
            }

            // Plus-Action Menu
            if ( plusActionMenuInfo.openedBlock ) {
                if ( event.key === 'Escape' )
                    return 'plusActionMenu-close'
            }
        },

        handleKeyCommand ( command, editorState, _, { setEditorState } ) {
            const { setPlusActionMenuInfo, blockLevelSelectionInfo } = getUiContext ()

            return {
                'select-all' () {
                    const contentState = editorState.getCurrentContent ()
                    const selectionState = editorState.getSelection ()
                    const anchorBlock = contentState.getBlockForKey ( selectionState.getAnchorKey () )
                    const newSelectionState = ( () => { // true: The selection is inside exactly 1 block and a part of it (not all of it)
                        if ( selectionState.isCollapsed () ) return true
                        if ( selectionState.getAnchorKey () !== selectionState.getFocusKey () ) return false
                        return selectionState.getStartOffset () > 0 || selectionState.getEndOffset () < anchorBlock.getLength ()
                    } ) ()
                        ? selectionState.merge ({
                            anchorOffset: 0, focusOffset: anchorBlock.getLength ()
                        })
                        : ( () => {
                            const firstBlock = contentState.getFirstBlock ()
                            const lastBlock = contentState.getLastBlock ()
                            return selectionState.merge ({
                                anchorKey: firstBlock.getKey (), focusKey: lastBlock.getKey (),
                                anchorOffset: 0, focusOffset: lastBlock.getLength ()
                            })
                        } ) ()
                    if ( ! selectionState.equals ( newSelectionState ) )
                        setEditorState ( EditorState.forceSelection ( editorState, newSelectionState ) )
                },

                'bls-disable' () {
                    const selectionState = editorState.getSelection ()
                    const newSelectionState = new SelectionState ({
                        anchorKey: selectionState.getAnchorKey (), anchorOffset: selectionState.getAnchorOffset (),
                        focusKey: selectionState.getAnchorKey (), focusOffset: selectionState.getAnchorOffset (),
                        isBackward: false, hasFocus: true
                    })
                    const newEditorState = EditorState.forceSelection ( editorState, newSelectionState )

                    setEditorState ( newEditorState )
                    setImmediate ( getUiContext ().disableBls )

                    return 'handled'
                },

                'bls-goDown' () {
                    setEditorState ( NASM.goDown ( editorState, blockLevelSelectionInfo ) )
                    return 'handled'
                },
                'bls-goUp' () {
                    setEditorState ( NASM.goUp ( editorState, blockLevelSelectionInfo ) )
                    return 'handled'
                },
                'bls-goDown-singleBlock' () {
                    setEditorState ( NASM.goDownSingleBlock ( editorState, blockLevelSelectionInfo ) )
                    return 'handled'
                },
                'bls-goUp-singleBlock' () {
                    setEditorState ( NASM.goUpSingleBlock ( editorState, blockLevelSelectionInfo ) )
                    return 'handled'
                },

                'bls-delete' () {
                    setEditorState ( blsAwareDelete ( editorState, blockLevelSelectionInfo ) )
                    setImmediate ( getUiContext ().disableBls )
                    return 'handled'
                },

                'plusActionMenu-close' () {
                    setPlusActionMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
                    return 'handled'
                }
            } [ command ]?.() || 'not-handled'
        }
    })
}
