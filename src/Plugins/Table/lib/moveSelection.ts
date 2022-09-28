import { EditorState, SelectionState } from 'draft-js'

import { TABLE_CELL_MARKER } from '..'

export function tableSelectionMoveForward(
    editorState: EditorState,
    setEditorState: SetState<EditorState>,
    selectionState: SelectionState,
    text: string,
    isWord?: boolean,
    isRange?: boolean
) {
    if (isWord) return
    const anchorOffset = selectionState.getAnchorOffset()
    const focusOffset = selectionState.getFocusOffset()
    if (focusOffset >= text.length - 1) {
        const nextBlock = editorState.getCurrentContent().getBlockAfter(selectionState.getAnchorKey())
        if (!nextBlock) return 'handled'
        const nextBlockKey = nextBlock.getKey()
        setEditorState(
            EditorState.forceSelection(
                editorState,
                selectionState.merge({
                    anchorKey: isRange ? selectionState.getAnchorKey() : nextBlockKey,
                    focusKey: nextBlockKey,
                    anchorOffset: isRange ? anchorOffset : 0,
                    focusOffset: 0,
                })
            )
        )
        return 'handled'
    }
    const newOffset = (() => {
        const nextValidOffset = focusOffset + (text[focusOffset] === TABLE_CELL_MARKER.end ? 2 : 1)
        if (!isWord) return nextValidOffset
        return nextValidOffset // TODO:
    })()
    setEditorState(
        EditorState.forceSelection(
            editorState,
            selectionState.merge({
                anchorOffset: isRange ? anchorOffset : newOffset,
                focusOffset: newOffset,
            })
        )
    )
}
