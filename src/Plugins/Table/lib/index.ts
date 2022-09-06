// * Barrel

import * as getCursorPositionInTable from './getCursorPositionInTable'
import * as getTableData from './getTableData'
import * as sumSegments from './sumSegments'

const tableLib = {
    ...getCursorPositionInTable,
    ...getTableData,
    ...sumSegments,
}
export default tableLib
