import { EditorState, SelectionState } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'
import { defaultBlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'

import * as NASM from 'BlockEditor/Lib/nestAwareSelectionModifier'


/**
 * Provides some User Interface functionality and keyboard shortcuts.
 */
export default function createUiHandlerPlugin (): EditorPlugin {
    return ({ getUiContext }) => ({
        id: '__internal__ui-handler',

        keyBindingFn ( event, { getEditorState } ) {
            const { plusActionMenuInfo, blockLevelSelectionInfo } = getUiContext ()

            if ( blockLevelSelectionInfo.enabled ) {
                if ( event.key === 'Escape' )
                    return 'bls-disable'
                if ( event.ctrlKey && (
                    [ 'c', 'x', 'v', 'z', 'y' ].indexOf ( event.key ) >= 0 ||
                    ( event.shiftKey && event.key === 'z' )
                ) ) return undefined
                if ( event.shiftKey ) {
                    const isBackward = getEditorState ().getSelection ().getIsBackward ()
                    if ( event.key === 'ArrowDown' )
                        return isBackward && blockLevelSelectionInfo.selectedBlockKeys.length > 1
                            ? 'bls-goDown' : undefined
                    if ( event.key === 'ArrowUp' )
                        return ! isBackward && blockLevelSelectionInfo.selectedBlockKeys.length > 1
                            ? 'bls-goUp' : undefined
                    return 'bls-ignoreKey'
                }
                return 'bls-ignoreKey'
            }

            if ( plusActionMenuInfo.openedBlock ) {
                if ( event.key === 'Escape' )
                    return 'plusActionMenu-close'
            }

            return undefined
        },

        handleKeyCommand ( command, editorState, _, { setEditorState } ) {
            const { setPlusActionMenuInfo, blockLevelSelectionInfo, setBlockLevelSelectionInfo, updateRtblSelectionState } = getUiContext ()

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
                    setImmediate ( () => {
                        updateRtblSelectionState ()
                        setBlockLevelSelectionInfo ( defaultBlockLevelSelectionInfo )
                    } )

                    return 'handled'
                },

                'bls-goDown' () {
                    const newEditorState = NASM.goDown ( editorState, blockLevelSelectionInfo )
                    setEditorState ( newEditorState )
                    return 'handled'
                },
                'bls-goUp' () {
                    const newEditorState = NASM.goUp ( editorState, blockLevelSelectionInfo )
                    setEditorState ( newEditorState )
                    return 'handled'
                },

                'bls-ignoreKey': () => 'handled'
            } [ command ]?.() || 'not-handled'
        }
    })
}
