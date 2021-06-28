import { ContentState, ContentBlock, DraftInsertionType } from 'draft-js'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'


/**
 * Moves a Content Block next to another Content Block.
 *
 * @param currentContent - Current Content State.
 * @param blockToBeMovoed - The Content Block that is to be moved.
 * @param targetBlock - The Content Block that @param blockToBeMovoed has to move next to it.
 * @param insertionMode - Whether to move @param blockToBeMovoed after the @param targetBlock or before it.
 *
 * @returns A new Content Block with moved @param blockToBeMovoed .
 */
export default function moveBlock (
    currentContent: ContentState,
    blockToBeMovoed: ContentBlock,
    targetBlock: ContentBlock,
    insertionMode: DraftInsertionType
): ContentState {
    try {
        return moveBlockInContentState ( currentContent, blockToBeMovoed, targetBlock, insertionMode )
    } catch { // A block cannot be moved next to itself
        return currentContent
    }
}
