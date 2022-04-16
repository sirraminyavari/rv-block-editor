import { EditorState } from 'draft-js'

import { ClipboardEventHandler } from '.'

import blsAwareDelete from 'BlockEditor/Lib/blsAwareDelete'
import copyHandler from './copy'


/**
 * Copies the selected content into clipboard and removes them from the state.
 * @refer to 'copyHandler' for more info.
 */
const cutHandler: ClipboardEventHandler = ( editor, getUiState, setEditorState, event ) => {
    const { blockLevelSelectionInfo, disableBls } = getUiState ()
    copyHandler ( editor, getUiState, setEditorState, event )
    const [ newSelectionState, newEditorState ] = blsAwareDelete ( editor.getEditorState (), blockLevelSelectionInfo )
    setEditorState ( EditorState.forceSelection ( editor.getEditorState (), newSelectionState ) )
    setImmediate ( () => {
        disableBls ()
        setEditorState ( newEditorState )
    } )
}
export default cutHandler
