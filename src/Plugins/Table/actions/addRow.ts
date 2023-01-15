import {
    EditorState,
    ContentState,
    SelectionState,
    ContentBlock,
    Modifier,
} from 'draft-js'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import tableLib from '../lib'

import { TABLE_CELL_MARKER } from '..'

/**
 * Adds a new row to @param tableBlock after the @param anchorCol-th row
 */
export function addRow(
    contentState: ContentState,
    tableBlock: ContentBlock,
    anchorRow: number
) {
    const { blockKey, rowN, colN, alignments } =
        tableLib.getTableData(tableBlock)

    const eoRowOffset = (() => {
        const skips = (anchorRow + 1) * colN
        const segments = tableBlock.getText().split(TABLE_CELL_MARKER.end)
        const before = segments.slice(0, skips)
        const beforeLen = before.reduce((a, v) => a + v.length, 0)
        return beforeLen + skips
    })()

    const newContentState = Modifier.insertText(
        mergeBlockData(EditorState.createWithContent(contentState), blockKey, {
            rowN: rowN + 1,
            alignments: tableLib.adjustAlignments(
                'row',
                'add',
                alignments,
                anchorRow,
                rowN,
                colN
            ),
        }).getCurrentContent(),
        SelectionState.createEmpty(blockKey).merge({
            anchorOffset: eoRowOffset,
            focusOffset: eoRowOffset,
        }),
        `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`.repeat(colN)
    )

    return newContentState
}
