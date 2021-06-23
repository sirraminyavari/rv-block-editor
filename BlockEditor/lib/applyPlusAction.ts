import { ContentBlock, EditorState, RichUtils, SelectionState, genKey } from 'draft-js'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'
import { List } from 'immutable'

import applyPlusActionToSelection from './applyPlusActionToSelection'


export default function applyPlusAction (
    editorState: EditorState,
    contentBlock: ContentBlock,
    plusAction: string
): EditorState {
    if ( ! contentBlock.getText () ) // There is no text in the current block so we should update it's type inplace
        return applyPlusActionToSelection ( editorState, contentBlock, plusAction )
    // There is some text in the current block so we should create a new block below it and set plusAction type for the newly created block
    const newContentBlock = new ContentBlock ({ key: genKey (), type: 'unstyled', text: '', characterList: List () })
    const contentState = editorState.getCurrentContent ()
    const contentStateWithNewBlock = moveBlockInContentState ( contentState, newContentBlock, contentBlock, 'after' )
    const newEditorState = EditorState.set ( editorState, { currentContent: contentStateWithNewBlock } )
    return applyPlusActionToSelection ( newEditorState, newContentBlock, plusAction )
}
