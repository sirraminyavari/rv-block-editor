import { EditorState } from 'draft-js'


export default function applyPlusAction (
    editorState: EditorState,
    currentBlockKey: string,
    plusAction: string
): EditorState {
    console.log ( editorState, currentBlockKey, plusAction )
    return editorState
}
