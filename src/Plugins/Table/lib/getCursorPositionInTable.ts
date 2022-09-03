import { ContentBlock, SelectionState } from 'draft-js'

import { TABLE_CELL_MARKER } from '..'

export default function getCursorPositionInTable(
    selectionState: SelectionState,
    tableBlock: ContentBlock,
    returnShadow?: boolean
) {
    const rowN = tableBlock.getData().get('rowN') as number
    const colN = tableBlock.getData().get('colN') as number

    if (!selectionState.isCollapsed() || tableBlock.getKey() !== selectionState.getAnchorKey())
        return returnShadow
            ? {
                  cell: rowN * colN - 1,
                  row: rowN - 1,
                  col: colN - 1,
              }
            : null

    const anchorOffset = selectionState.getAnchorOffset()
    const text = tableBlock.getText()

    const cell = text.slice(0, anchorOffset).split(TABLE_CELL_MARKER.end).length - 1
    const row = Math.floor(cell / colN)
    const col = cell % colN

    return { cell, row, col }
}
