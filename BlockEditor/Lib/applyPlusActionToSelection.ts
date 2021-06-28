import { EditorState, RichUtils } from 'draft-js'


/**
 * Toggles the specified Plus Action on the Content Block that the cursor resides on.
 *
 * @param editorState - Current Editor State.
 * @param plusAction - The Plus Action to be toggled.
 *
 * @returns A new Editor State with the specified Plus Action toggled.
 */
export default function applyPlusActionToSelection (
    editorState: EditorState,
    plusAction: string
): EditorState {
    const editorStateAfterPlusAction = RichUtils.toggleBlockType ( editorState, plusAction )
    return editorStateAfterPlusAction
}
