import { EditorState, ContentBlock } from 'draft-js'

import tableLib from '../lib'
import { removeRow } from './removeRow'

export function removeRowByCursor(
    editorState: EditorState,
    tableBlock: ContentBlock
) {
    const anchorRow = tableLib.getCursorPositionInTable(
        editorState.getSelection(),
        tableBlock,
        true
    ).row
    const newContentState = removeRow(
        editorState.getCurrentContent(),
        tableBlock,
        anchorRow
    )
    return EditorState.push(editorState, newContentState, 'change-block-data')
}
