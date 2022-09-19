// * Barrel

import * as adjustSelection from './adjustSelection'
import * as getCursorPositionInTable from './getCursorPositionInTable'
import * as getOffsetPositionsInTable from './getOffsetPositionsInTable'
import * as getTableData from './getTableData'
import * as isSelectionInsideOneTable from './isSelectionInsideOneTable'
import * as sumSegments from './sumSegments'

const tableLib = {
    ...adjustSelection,
    ...getCursorPositionInTable,
    ...getOffsetPositionsInTable,
    ...getTableData,
    ...isSelectionInsideOneTable,
    ...sumSegments,
}
export default tableLib
