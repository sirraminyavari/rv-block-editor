import { EditorState, ContentState, SelectionState, ContentBlock, Modifier } from 'draft-js'
import _ from 'lodash'
import mergeBlockData from '../../../BlockEditor/Lib/mergeBlockData'
import { getTableData, sumSegments } from './utils'

import { TABLE_CELL_MARKER } from '..'

export default function removeCol(contentState: ContentState, tableBlock: ContentBlock, anchorCol: number) {
    const { blockKey, rowN, colN } = getTableData(tableBlock)
    if (colN <= 1) return contentState

    const offsets = (() => {
        const segments = tableBlock.getText().split(TABLE_CELL_MARKER.end)
        const groups = [segments.slice(0, anchorCol + 1), ..._.chunk(segments.slice(anchorCol + 1), colN)].slice(
            0,
            rowN
        )
        const relativeOffsets = groups.map(g => sumSegments(g))
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

    // We reverse the offsets so deletions wont affect their correctness
    const newContentState = offsets.reverse().reduce((contentState, offset) => {
        return Modifier.removeRange(contentState, SelectionState.createEmpty(blockKey).merge(offset), 'backward')
    }, mergeBlockData(EditorState.createWithContent(contentState), blockKey, { colN: colN - 1 }).getCurrentContent())

    return newContentState
}
