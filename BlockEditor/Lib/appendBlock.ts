import { ContentState, ContentBlock } from 'draft-js'


/**
 * Appends a non-existing Content Block to the end of a Content State.
 *
 * @param currentContent - Current Content State.
 * @param blockToBeAppended - The Content Block that is to be appended
 *
 * @returns A new Content State with @param blockToBeAppended appended at the end of its Block Array.
 */
export default function appendBlock (
    currentContent: ContentState,
    blockToBeAppended: ContentBlock
): ContentState {
    return ContentState.createFromBlockArray ([
        ...currentContent.getBlockMap ().toArray (),
        blockToBeAppended
    ])
}
