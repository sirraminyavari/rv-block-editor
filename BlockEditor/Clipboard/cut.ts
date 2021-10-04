import { ClipboardEventHandler } from '.'


const cutHandler: ClipboardEventHandler = ( editor, getUiState, setEditorState, event ) => {
    event.preventDefault ()
    const { getEditorState, setState } = editor
    const editorState = getEditorState ()
}
export default cutHandler
