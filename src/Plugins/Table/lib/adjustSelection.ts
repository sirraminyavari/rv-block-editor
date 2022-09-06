import { EditorState } from 'draft-js'

import { TABLE_CELL_MARKER } from '..'
import { isSelectionInsideOneTable } from './isSelectionInsideOneTable'

export function adjustSelection(editorState: EditorState) {
    const selectionStatus = isSelectionInsideOneTable(editorState)
    if (!selectionStatus.isSelectionInsideOneTable) return editorState
    const { selection, tableBlock } = selectionStatus

    const text = tableBlock.getText()
    const aOffset = selection.getAnchorOffset()

    if (text[aOffset] !== TABLE_CELL_MARKER.start && text[aOffset - 1] !== TABLE_CELL_MARKER.end) return editorState

    const domSelection = getSelection()
    const cellElem = domSelection.anchorNode.parentElement.closest('[data-table-cell]')
    if (!cellElem) return editorState

    const cellN = [...cellElem.parentElement.children].indexOf(cellElem)
    const cellBeforeN = text.slice(0, aOffset).split(TABLE_CELL_MARKER.end).length - 1

    const adjustedOffset = aOffset + (cellN >= cellBeforeN ? 1 : -1)

    return EditorState.forceSelection(
        editorState,
        selection.merge({ anchorOffset: adjustedOffset, focusOffset: adjustedOffset })
    )
}
