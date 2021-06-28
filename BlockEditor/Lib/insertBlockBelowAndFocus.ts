import { ContentBlock, EditorState, SelectionState } from 'draft-js'
import appendBlock from './appendBlock'
import moveBlock from './moveBlock'


/**
 * Inserts a non-existing Content Block after an existing one and moves the cursor to the newly appended Content Block.
 *
 * @param editorState - Current Editor State.
 * @param blockToBeInserted - The Content Block that is to be inserted.
 * @param targetBlock - The Content Block after witch @param blockToBeInserted needs to be inserted.
 *
 * @returns A new Editor State containing the newly inserted block.
 */
export default function insertBlockBelowAndFocus (
    editorState: EditorState,
    blockToBeInserted: ContentBlock,
    targetBlock: ContentBlock
): EditorState {
    const contentStateWithNewBlock = appendBlock ( editorState.getCurrentContent (), blockToBeInserted )
    const contentStateWithNewBlockMoved = moveBlock ( contentStateWithNewBlock, blockToBeInserted, targetBlock, 'after' )
    const newEditorState = EditorState.push ( editorState, contentStateWithNewBlockMoved, 'insert-fragment' )

    const blockToBeInsertedKey = blockToBeInserted.getKey ()
    const selectionState = new SelectionState ({
        anchorKey: blockToBeInsertedKey, anchorOffset: 0,
        focusKey: blockToBeInsertedKey, focusOffset: 0,
        isBackward: false, hasFocus: true
    })
    const editorStateAfterSelection = EditorState.forceSelection ( newEditorState, selectionState )

    return editorStateAfterSelection
}
