// * Barrel

import * as adjustSelection from './adjustSelection'
import * as text from './text'
import * as getCursorPositionInTable from './getCursorPositionInTable'
import * as getOffsetPositionsInTable from './getOffsetPositionsInTable'
import * as getTableData from './getTableData'
import * as isSelectionInsideOneTable from './isSelectionInsideOneTable'
import * as sumSegments from './sumSegments'

const tableLib = {
    ...adjustSelection,
    ...text,
    ...getCursorPositionInTable,
    ...getOffsetPositionsInTable,
    ...getTableData,
    ...isSelectionInsideOneTable,
    ...sumSegments,
}
export default tableLib
