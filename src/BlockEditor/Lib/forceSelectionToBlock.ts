import { EditorState, SelectionState } from 'draft-js'

/**
 * Sets the cursor at the beggining of a specified block.
 *
 * @param editorState - Current Editor State.
 * @param blockKey - The key of the block on which the cursor must be set.
 *
 * @returns A new Editor State with the cursor at the beggining of the block with @param blockKey as its key.
 */
export default function forceSelectionToBlock(
    editorState: EditorState,
    blockKey: string
): EditorState {
    const selectionState = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: 0,
        isBackward: false,
        hasFocus: true,
    })
    return EditorState.forceSelection(editorState, selectionState)
}
