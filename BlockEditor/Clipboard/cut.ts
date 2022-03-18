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
    setEditorState ( blsAwareDelete ( editor.getEditorState (), blockLevelSelectionInfo ) )
    setImmediate ( disableBls )
}
export default cutHandler
