// * Barrel

import * as addRow from './addRow'
import * as addRowAfterCursor from './addRowAfterCursor'
import * as addCol from './addCol'
import * as addColAfterCursor from './addColAfterCursor'
import * as removeRow from './removeRow'
import * as removeRowByCursor from './removeRowByCursor'
import * as removeCol from './removeCol'
import * as removeColByCursor from './removeColByCursor'
import * as removeTable from './removeTable'

const tableActions = {
    ...addRow,
    ...addRowAfterCursor,
    ...addCol,
    ...addColAfterCursor,
    ...removeRow,
    ...removeRowByCursor,
    ...removeCol,
    ...removeColByCursor,
    ...removeTable,
}
export default tableActions
