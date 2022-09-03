import { EditorState, ContentState, SelectionState, ContentBlock, Modifier } from 'draft-js'
import _ from 'lodash'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'

import { TABLE_CELL_MARKER } from '..'

export default function addRow(contentState: ContentState, tableBlock: ContentBlock, anchorRow: number) {
    const blockKey = tableBlock.getKey()
    const rowN = tableBlock.getData().get('rowN') as number
    const colN = tableBlock.getData().get('colN') as number

    const eoRowOffset = (() => {
        const skips = (anchorRow + 1) * colN
        const segments = tableBlock.getText().split(TABLE_CELL_MARKER.end)
        const before = segments.slice(0, skips)
        const beforeLen = before.reduce((a, v) => a + v.length, 0)
        return beforeLen + skips
    })()

    const newContentState = Modifier.insertText(
        mergeBlockData(EditorState.createWithContent(contentState), tableBlock.getKey(), {
            rowN: rowN + 1,
        }).getCurrentContent(),
        SelectionState.createEmpty(blockKey).merge({ anchorOffset: eoRowOffset, focusOffset: eoRowOffset }),
        `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`.repeat(colN)
    )

    return newContentState
}
