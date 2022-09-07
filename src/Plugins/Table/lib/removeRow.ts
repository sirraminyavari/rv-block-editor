import { EditorState, ContentState, SelectionState, ContentBlock, Modifier } from 'draft-js'
import _ from 'lodash'
import mergeBlockData from '../../../BlockEditor/Lib/mergeBlockData'
import { getTableData, sumSegments } from './utils'

import { TABLE_CELL_MARKER } from '..'

export default function removeRow(contentState: ContentState, tableBlock: ContentBlock, anchorRow: number) {
    const { blockKey, rowN, colN } = getTableData(tableBlock)
    if (rowN <= 1) return contentState

    const offsets = (() => {
        const skips = (anchorRow + 1) * colN
        const segments = tableBlock.getText().split(TABLE_CELL_MARKER.end)
        const before = segments.slice(0, skips)
        const end = sumSegments(before)
        const start = end - sumSegments(_.takeRight(before, colN))
        return { start, end }
    })()

    const newContentState = Modifier.removeRange(
        mergeBlockData(EditorState.createWithContent(contentState), blockKey, {
            rowN: rowN - 1,
        }).getCurrentContent(),
        SelectionState.createEmpty(blockKey).merge({ anchorOffset: offsets.start, focusOffset: offsets.end }),
        'backward'
    )

    return newContentState
}
