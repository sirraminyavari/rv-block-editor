import { ClipboardEventHandler } from '.'

import blsAwareDelete from '../Lib/blsAwareDelete'
import copyHandler from './copy'

/**
 * Copies the selected content into clipboard and removes them from the state.
 * @refer to 'copyHandler' for more info.
 */
const cutHandler: ClipboardEventHandler = (
    editor,
    getUiState,
    setEditorState,
    event
) => {
    const { blockLevelSelectionInfo, disableBls, suspendBls } = getUiState()
    copyHandler(editor, getUiState, setEditorState, event)
    const newEditorState = blsAwareDelete(
        editor.getEditorState(),
        blockLevelSelectionInfo
    )
    suspendBls.current = true
    setEditorState(newEditorState)
    disableBls()
    setImmediate(() => {
        suspendBls.current = false
    })
}
export default cutHandler
