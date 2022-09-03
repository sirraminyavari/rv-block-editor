import { EditorState, ContentState, SelectionState, ContentBlock, Modifier } from 'draft-js'
import _ from 'lodash'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import { getTableData, sumSegments } from './utils'

import { TABLE_CELL_MARKER } from '..'

export default function addCol(contentState: ContentState, tableBlock: ContentBlock, anchorCol: number) {
    const { blockKey, rowN, colN } = getTableData(tableBlock)

    const eoColOffsets = (() => {
        const segments = tableBlock.getText().split(TABLE_CELL_MARKER.end)
        const groups = [segments.slice(0, anchorCol + 1), ..._.chunk(segments.slice(anchorCol + 1), colN)].slice(
            0,
            rowN
        )
        const relativeOffsets = groups.map(g => sumSegments(g))
        const absoluteOffsets = relativeOffsets.reduce((absoluteOffsets, relativeOffset, i) => {
            if (i === 0) return [relativeOffset]
            return absoluteOffsets.concat([absoluteOffsets[i - 1] + relativeOffset])
        }, [])
        return absoluteOffsets
    })()

    const newContentState = eoColOffsets.reduce((contentState, offset, i) => {
        const adjustedOffset = offset + i * 2
        return Modifier.insertText(
            contentState,
            SelectionState.createEmpty(blockKey).merge({ anchorOffset: adjustedOffset, focusOffset: adjustedOffset }),
            `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`
        )
    }, mergeBlockData(EditorState.createWithContent(contentState), blockKey, { colN: colN + 1 }).getCurrentContent())

    return newContentState
}
