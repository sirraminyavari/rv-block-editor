import { ContentBlock, EditorState } from 'draft-js'

import insertEmptyBlockBelowAndFocus from './insertEmptyBlockBelowAndFocus'
import applyPlusActionToSelection from './applyPlusActionToSelection'


export default function applyPlusAction (
    editorState: EditorState,
    contentBlock: ContentBlock,
    plusAction: string
): EditorState {
    if ( ! contentBlock.getText () ) // There is no text in the current block so we should update it's type inplace
        return applyPlusActionToSelection ( editorState, contentBlock, plusAction )
    // There is some text in the current block so we should create a new block below it and set plusAction type for the newly created block
    const { newEditorState, newContentBlock } = insertEmptyBlockBelowAndFocus ( editorState, contentBlock )
    return applyPlusActionToSelection ( newEditorState, newContentBlock, plusAction )
}
