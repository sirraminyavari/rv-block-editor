import { EditorState, ContentBlock } from 'draft-js'

import removeRow from './removeRow'
import getCursorPositionInTable from './getCursorPositionInTable'

export default function removeRowByCursor(editorState: EditorState, tableBlock: ContentBlock) {
    const anchorRow = getCursorPositionInTable(editorState.getSelection(), tableBlock, true).row
    const newContentState = removeRow(editorState.getCurrentContent(), tableBlock, anchorRow)
    return EditorState.push(editorState, newContentState, 'change-block-data')
}
