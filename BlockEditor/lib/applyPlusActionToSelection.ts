import { EditorState, RichUtils } from 'draft-js'


export default function applyPlusActionToSelection (
    editorState: EditorState,
    plusAction: string
): EditorState {
    const editorStateAfterPlusAction = RichUtils.toggleBlockType ( editorState, plusAction )
    return editorStateAfterPlusAction
}
