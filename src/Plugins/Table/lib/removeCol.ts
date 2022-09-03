import { EditorState, ContentState, SelectionState, ContentBlock, Modifier } from 'draft-js'
import _ from 'lodash'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import { getTableData } from './utils'

import { TABLE_CELL_MARKER } from '..'

export default function removeCol(contentState: ContentState, tableBlock: ContentBlock, anchorCol: number) {
    const { blockKey, rowN, colN } = getTableData(tableBlock)

    const newContentState = contentState

    return newContentState
}
