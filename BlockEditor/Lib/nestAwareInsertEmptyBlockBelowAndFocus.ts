import { ContentBlock, EditorState } from 'draft-js'

import insertEmptyBlockBelowAndFocus from './insertEmptyBlockBelowAndFocus'
import blsAwareGetBlockRange from './blsAwareGetBlockRange'


/**
 * Inserts a new empty block below the focused block and moves the cursor
 * into the newly selected block (focus) while taking nesting into account.
 */
export default function nestAwareInsertEmptyBlockBelowAndFocus (
    editorState: EditorState,
    initialTargetBlock: ContentBlock,
    depth: number = 0
): {
    newEditorState: EditorState
    newContentBlock: ContentBlock
} {
    const initialTargetBlockKey = initialTargetBlock.getKey ()
    const blockRange = blsAwareGetBlockRange ( editorState.getCurrentContent ().getBlockMap (), initialTargetBlockKey, initialTargetBlockKey )
    const targetBlock = blockRange.last ()
    const { newEditorState, newContentBlock } = insertEmptyBlockBelowAndFocus ( editorState, targetBlock, depth )
    return { newEditorState, newContentBlock }
}
