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
                'plusActionMenu-close' () {
                    setPlusActionMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
                    return 'handled'
                },

                'bls-disable' () {
                    const selection = editorState.getSelection ()
                    const newSelection = new SelectionState ({
                        anchorKey: selection.getAnchorKey (), anchorOffset: selection.getAnchorOffset (),
                        focusKey: selection.getAnchorKey (), focusOffset: selection.getAnchorOffset (),
                        isBackward: false, hasFocus: true
                    })
                    const newEditorState = EditorState.forceSelection ( editorState, newSelection )

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
                }
            } [ command ]?.() || 'not-handled'
        }
    })
}
