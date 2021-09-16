import { ContentBlock, EditorState } from 'draft-js'

import createEmptyBlock from './createEmptyBlock'
import insertBlockBelowAndFocus from './insertBlockBelowAndFocus'


/**
 * Created a new and empty Content Block after an existing one and moves the cursor to the newly created Content Block.
 *
 * @param editorState - Current Editor State.
 * @param targetBlock - Specifies the Content Block after witch a new Content Block needs to be created.
 *
 * @returns An object containing the newly created Content Block and the Editor State after its creation.
 */
export default function insertEmptyBlockBelowAndFocus (
    editorState: EditorState,
    targetBlock: ContentBlock,
    depth: number = 0
): {
    newEditorState: EditorState
    newContentBlock: ContentBlock
} {
    const newContentBlock = createEmptyBlock ( depth )
    const newEditorState = insertBlockBelowAndFocus ( editorState, newContentBlock, targetBlock )
    return { newEditorState, newContentBlock }
}
