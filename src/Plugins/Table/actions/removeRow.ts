import {
    EditorState,
    ContentState,
    SelectionState,
    ContentBlock,
    Modifier,
} from 'draft-js'
import _ from 'lodash'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import tableLib from '../lib'

import { TABLE_CELL_MARKER } from '..'

export function removeRow(
    contentState: ContentState,
    tableBlock: ContentBlock,
    anchorRow: number
) {
    const { blockKey, rowN, colN, alignments } =
        tableLib.getTableData(tableBlock)
    if (rowN <= 1) return contentState

    const offsets = (() => {
        const skips = (anchorRow + 1) * colN
        const segments = tableBlock.getText().split(TABLE_CELL_MARKER.end)
        const before = segments.slice(0, skips)
        const end = tableLib.sumSegments(before)
        const start = end - tableLib.sumSegments(_.takeRight(before, colN))
        return { start, end }
    })()

    const newContentState = Modifier.removeRange(
        mergeBlockData(EditorState.createWithContent(contentState), blockKey, {
            rowN: rowN - 1,
            alignments: tableLib.adjustAlignments(
                'row',
                'remove',
                alignments,
                anchorRow,
                rowN,
                colN
            ),
        }).getCurrentContent(),
        SelectionState.createEmpty(blockKey).merge({
            anchorOffset: offsets.start,
            focusOffset: offsets.end,
        }),
        'backward'
    )

    return newContentState
}
