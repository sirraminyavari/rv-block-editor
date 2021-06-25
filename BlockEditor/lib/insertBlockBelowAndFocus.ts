import { ContentBlock, EditorState, SelectionState } from 'draft-js'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'


export default function insertBlockBelowAndFocus (
    editorState: EditorState,
    blockToBeInserted: ContentBlock,
    targetBlock: ContentBlock
): EditorState {
    const contentState = editorState.getCurrentContent ()
    const contentStateWithNewBlock = moveBlockInContentState ( contentState, blockToBeInserted, targetBlock, 'after' )
    const editorStateWithNewBlock = EditorState.set ( editorState, { currentContent: contentStateWithNewBlock } )
    const contentBlockKey = blockToBeInserted.getKey ()
    const selectionState = new SelectionState ({
        anchorKey: contentBlockKey, anchorOffset: 0,
        focusKey: contentBlockKey, focusOffset: 0,
        isBackward: false, hasFocus: true,
    })
    const editorStateAfterSelection = EditorState.forceSelection ( editorStateWithNewBlock, selectionState )
    return editorStateAfterSelection
}
