import { EditorState, ContentBlock } from 'draft-js'

import tableLib from '../lib'
import { addRow } from './addRow'

export function addRowAfterCursor(editorState: EditorState, tableBlock: ContentBlock) {
    const anchorRow = tableLib.getCursorPositionInTable(editorState.getSelection(), tableBlock, true).row
    const newContentState = addRow(editorState.getCurrentContent(), tableBlock, anchorRow)
    return EditorState.push(editorState, newContentState, 'change-block-data')
}
