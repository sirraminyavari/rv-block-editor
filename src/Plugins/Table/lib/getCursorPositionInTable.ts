import { ContentBlock, SelectionState } from 'draft-js'

import { getTableData } from './getTableData'
import { getOffsetPositionsInTable } from './getOffsetPositionsInTable'

export function getCursorPositionInTable(
    selectionState: SelectionState,
    tableBlock: ContentBlock,
    returnShadow?: boolean
) {
    const { blockKey, rowN, colN } = getTableData(tableBlock)

    if (
        !selectionState.isCollapsed() ||
        blockKey !== selectionState.getAnchorKey()
    )
        return returnShadow
            ? {
                  cell: rowN * colN - 1,
                  row: rowN - 1,
                  col: colN - 1,
              }
            : null

    const anchorOffset = selectionState.getAnchorOffset()
    const text = tableBlock.getText()

    return getOffsetPositionsInTable(anchorOffset, colN, text)
}
