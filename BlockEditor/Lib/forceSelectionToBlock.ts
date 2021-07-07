import { EditorState, SelectionState } from 'draft-js'


export default function forceSelectionToBlock (
    editorState: EditorState,
    blockKey: string
): EditorState {
    const selectionState = new SelectionState ({
        anchorKey: blockKey, anchorOffset: 0,
        focusKey: blockKey, focusOffset: 0,
        isBackward: false, hasFocus: true
    })
    return EditorState.forceSelection ( editorState, selectionState )
}
