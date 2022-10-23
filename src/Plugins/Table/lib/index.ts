// * Barrel

import * as adjustAlignments from './adjustAlignments'
import * as adjustSelection from './adjustSelection'
import * as getCursorPositionInTable from './getCursorPositionInTable'
import * as getOffsetPositionsInTable from './getOffsetPositionsInTable'
import * as getTableData from './getTableData'
import * as isSelectionInsideOneTable from './isSelectionInsideOneTable'
import * as sumSegments from './sumSegments'
import * as text from './text'

const tableLib = {
    ...adjustAlignments,
    ...adjustSelection,
    ...getCursorPositionInTable,
    ...getOffsetPositionsInTable,
    ...getTableData,
    ...isSelectionInsideOneTable,
    ...sumSegments,
    ...text,
}
export default tableLib
