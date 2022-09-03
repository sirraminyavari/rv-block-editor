import { EditorState, ContentState, SelectionState, ContentBlock, Modifier } from 'draft-js'
import _ from 'lodash'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'

import { TABLE_CELL_MARKER } from '..'

export default function removeRow(contentState: ContentState, tableBlock: ContentBlock, anchorRow: number) {
    const blockKey = tableBlock.getKey()
    const rowN = tableBlock.getData().get('rowN') as number
    const colN = tableBlock.getData().get('colN') as number

    const newContentState = contentState

    return newContentState
}
