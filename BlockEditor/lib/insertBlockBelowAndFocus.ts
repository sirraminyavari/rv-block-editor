import { ContentBlock, EditorState, SelectionState, ContentState } from 'draft-js'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'


export default function insertBlockBelowAndFocus (
    editorState: EditorState,
    blockToBeInserted: ContentBlock,
    targetBlock: ContentBlock
): EditorState {
    const contentState = editorState.getCurrentContent ()
    const contentStateWithNewBlock = ContentState.createFromBlockArray ([
        ...contentState.getBlockMap ().toArray (),
        blockToBeInserted
    ])

    const contentStateWithMovedNewBlock = ( () => { try {
        return moveBlockInContentState (
            contentStateWithNewBlock,
            blockToBeInserted, targetBlock, 'after'
        )
    } catch {
        return contentStateWithNewBlock
    } } ) ()

    const newEditorState = EditorState.push ( editorState, contentStateWithMovedNewBlock, 'insert-fragment' )
    const blockToBeInsertedKey = blockToBeInserted.getKey ()
    const selectionState = new SelectionState ({
        anchorKey: blockToBeInsertedKey, anchorOffset: 0,
        focusKey: blockToBeInsertedKey, focusOffset: 0,
        isBackward: false, hasFocus: true
    })
    const editorStateAfterSelection = EditorState.forceSelection ( newEditorState, selectionState )
    return editorStateAfterSelection
}
