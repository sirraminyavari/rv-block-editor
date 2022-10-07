import { EditorState, ContentState, SelectionState, ContentBlock, Modifier } from 'draft-js'
import _ from 'lodash'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import tableLib from '../lib'

import { TABLE_CELL_MARKER } from '..'

export function removeCol(contentState: ContentState, tableBlock: ContentBlock, anchorCol: number) {
    const { blockKey, rowN, colN, alignments } = tableLib.getTableData(tableBlock)
    if (colN <= 1) return contentState

    const offsets = (() => {
        const segments = tableBlock.getText().split(TABLE_CELL_MARKER.end)
        const groups = [segments.slice(0, anchorCol + 1), ..._.chunk(segments.slice(anchorCol + 1), colN)].slice(
            0,
            rowN
        )
        const relativeOffsets = groups.map(g => tableLib.sumSegments(g))
        const absoluteOffsets: number[] = relativeOffsets.reduce((absoluteOffsets, relativeOffset, i) => {
            if (i === 0) return [relativeOffset]
            return absoluteOffsets.concat([absoluteOffsets[i - 1] + relativeOffset])
        }, [])
        return absoluteOffsets.map((focusOffset, i) => {
            return {
                anchorOffset: focusOffset - segments[i * colN + anchorCol].length - 1,
                focusOffset,
            }
        })
    })()

    const newContentState = _.chain(contentState)
        .thru(contentState =>
            mergeBlockData(EditorState.createWithContent(contentState), blockKey, {
                colN: colN - 1,
                alignments: tableLib.adjustAlignments('col', 'remove', alignments, anchorCol, rowN, colN),
            }).getCurrentContent()
        )
        // Reverse the offsets so deletions wont affect their relative positions
        .thru(contentState =>
            offsets.reverse().reduce((contentState, offset) => {
                return Modifier.removeRange(
                    contentState,
                    SelectionState.createEmpty(blockKey).merge(offset),
                    'backward'
                )
            }, contentState)
        )
        .value()

    return newContentState
}
