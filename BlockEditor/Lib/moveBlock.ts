import { ContentState, ContentBlock, DraftInsertionType } from 'draft-js'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'


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
