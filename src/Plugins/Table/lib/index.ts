// * Barrel

import * as adjustSelection from './adjustSelection'
import * as getCursorPositionInTable from './getCursorPositionInTable'
import * as getOffsetPositionsInTable from './getOffsetPositionsInTable'
import * as getTableData from './getTableData'
import * as isSelectionInsideOneTable from './isSelectionInsideOneTable'
import * as moveSelection from './moveSelection'
import * as sumSegments from './sumSegments'
import * as text from './text'

const tableLib = {
    ...adjustSelection,
    ...getCursorPositionInTable,
    ...getOffsetPositionsInTable,
    ...getTableData,
    ...isSelectionInsideOneTable,
    ...moveSelection,
    ...sumSegments,
    ...text,
}
export default tableLib
