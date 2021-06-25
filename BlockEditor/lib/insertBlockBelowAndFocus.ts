import { ContentBlock, EditorState } from 'draft-js'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'


export default function insertBlockBelowAndFocus (
    editorState: EditorState,
    blockToBeInserted: ContentBlock,
    targetBlock: ContentBlock
): EditorState {
    const contentState = editorState.getCurrentContent ()
    const contentStateWithNewBlock = moveBlockInContentState ( contentState, blockToBeInserted, targetBlock, 'after' )
    const newEditorState = EditorState.set ( editorState, { currentContent: contentStateWithNewBlock } )
    return newEditorState
}
