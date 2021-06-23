import { ContentBlock, EditorState, RichUtils, SelectionState } from 'draft-js'


export default function applyPlusActionToSelection (
    editorState: EditorState,
    contentBlock: ContentBlock,
    plusAction: string
): EditorState {
    const contentBlockKey = contentBlock.getKey ()
    const selectionState = new SelectionState ({
        anchorKey: contentBlockKey, anchorOffset: 0,
        focusKey: contentBlockKey, focusOffset: 0,
        isBackward: false, hasFocus: true,
    })
    const editorStateAfterSelection = EditorState.forceSelection ( editorState, selectionState )
    const editorStateAfterPlusAction = RichUtils.toggleBlockType ( editorStateAfterSelection, plusAction )
    return editorStateAfterPlusAction
}
