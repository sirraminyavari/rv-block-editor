import { ContentBlock, EditorState, ContentState, RichUtils, SelectionState, genKey } from 'draft-js'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'
import { List } from 'immutable'


export default function applyPlusAction (
    editorState: EditorState,
    contentBlock: ContentBlock,
    plusAction: string
): EditorState {
    if ( ! contentBlock.getText () ) // There is no text in the current block so we should update it's type inplace
        return applyPlusActionToSelection ( editorState, contentBlock.getKey (), plusAction )
    // There is some text in the current block so we should create a new block below it and set plusAction type for the newly created block
    const newContentBlock = new ContentBlock ({ key: genKey (), type: 'unstyled', text: '', characterList: List () })
    const contentState = editorState.getCurrentContent ()
    const contentStateWithNewBlock = moveBlockInContentState ( contentState, newContentBlock, contentBlock, 'after' )
    const newEditorState = EditorState.set ( editorState, { currentContent: contentStateWithNewBlock } )
    return applyPlusActionToSelection ( newEditorState, newContentBlock.getKey (), plusAction )
}

function applyPlusActionToSelection (
    editorState: EditorState,
    blockKey: string,
    plusAction: string
): EditorState {
    const selectionState = new SelectionState ({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: 0,
        isBackward: false,
        hasFocus: true,
    })
    const editorStateAfterSelection = EditorState.forceSelection ( editorState, selectionState )
    const editorStateAfterPlusAction = RichUtils.toggleBlockType ( editorStateAfterSelection, plusAction )
    return editorStateAfterPlusAction
}
