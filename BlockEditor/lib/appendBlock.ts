import { ContentState, ContentBlock } from 'draft-js'


export default function appendBlock (
    currentContent: ContentState,
    blockToBeAppended: ContentBlock
): ContentState {
    return ContentState.createFromBlockArray ([
        ...currentContent.getBlockMap ().toArray (),
        blockToBeAppended
    ])
}
