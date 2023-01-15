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

/**
 * Adds a new column to @param tableBlock after the @param anchorCol-th column
 */
export function addCol(
    contentState: ContentState,
    tableBlock: ContentBlock,
    anchorCol: number
) {
    const { blockKey, rowN, colN, alignments } =
        tableLib.getTableData(tableBlock)

    const eoColOffsets = (() => {
        const segments = tableBlock.getText().split(TABLE_CELL_MARKER.end)
        const groups = [
            segments.slice(0, anchorCol + 1),
            ..._.chunk(segments.slice(anchorCol + 1), colN),
        ].slice(0, rowN)
        const relativeOffsets = groups.map(g => tableLib.sumSegments(g))
        const absoluteOffsets = relativeOffsets.reduce(
            (absoluteOffsets, relativeOffset, i) => {
                if (i === 0) return [relativeOffset]
                return absoluteOffsets.concat([
                    absoluteOffsets[i - 1] + relativeOffset,
                ])
            },
            []
        )
        return absoluteOffsets
    })()

    const newContentState = _.chain(contentState)
        .thru(contentState =>
            mergeBlockData(
                EditorState.createWithContent(contentState),
                blockKey,
                {
                    colN: colN + 1,
                    alignments: tableLib.adjustAlignments(
                        'col',
                        'add',
                        alignments,
                        anchorCol,
                        rowN,
                        colN
                    ),
                }
            ).getCurrentContent()
        )
        // Reverse the offsets so additions wont affect their relative positions
        .thru(contentState =>
            eoColOffsets.reverse().reduce((contentState, offset) => {
                return Modifier.insertText(
                    contentState,
                    SelectionState.createEmpty(blockKey).merge({
                        anchorOffset: offset,
                        focusOffset: offset,
                    }),
                    `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`
                )
            }, contentState)
        )
        .value()

    return newContentState
}
