import { ContentBlock, EditorState } from 'draft-js'

import createEmptyBlock from './createEmptyBlock'
import insertBlockBelowAndFocus from './insertBlockBelowAndFocus'


export default function insertEmptyBlockBelowAndFocus (
    editorState: EditorState,
    targetBlock: ContentBlock
): {
    newEditorState: EditorState
    newContentBlock: ContentBlock
} {
    const newContentBlock = createEmptyBlock ()
    const newEditorState = insertBlockBelowAndFocus ( editorState, newContentBlock, targetBlock )
    return { newEditorState, newContentBlock }
}
