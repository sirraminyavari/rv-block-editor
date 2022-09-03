import { ContentBlock, SelectionState } from 'draft-js'

import { TABLE_CELL_MARKER } from '..'

export default function getCursorPositionInTable(selectionState: SelectionState, tableBlock: ContentBlock) {
    if (!selectionState.isCollapsed() || tableBlock.getKey() !== selectionState.getAnchorKey()) return null

    const anchorOffset = selectionState.getAnchorOffset()
    const text = tableBlock.getText()
    const colN = tableBlock.getData().get('colN') as number

    const cell = text.slice(0, anchorOffset).split(TABLE_CELL_MARKER.end).length - 1
    const row = Math.floor(cell / colN)
    const col = cell % colN

    return { cell, row, col }
}
