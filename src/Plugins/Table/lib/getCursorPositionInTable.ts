import { ContentBlock, SelectionState } from 'draft-js'

import { getTableData } from './getTableData'
import { getOffsetPositionsInTable } from './getOffsetPositionsInTable'

/**
 * Gets cursor's position extracted from @param selectionState
 * inside @param tableBlock .
 *
 * @param returnShadow returns a fake cell (last cell in the table) if
 * the cursor is not qualified i.e. not inside one table or not collapsed.
 */
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
