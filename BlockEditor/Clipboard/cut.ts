import { ClipboardEventHandler } from '.'

import blsAwareDelete from 'BlockEditor/Lib/blsAwareDelete'
import copyHandler from './copy'


const cutHandler: ClipboardEventHandler = ( editor, getUiState, setEditorState, event ) => {
    const { blockLevelSelectionInfo, disableBls } = getUiState ()
    copyHandler ( editor, getUiState, setEditorState, event )
    setEditorState ( blsAwareDelete ( editor.getEditorState (), blockLevelSelectionInfo ) )
    setImmediate ( disableBls )
}
export default cutHandler
