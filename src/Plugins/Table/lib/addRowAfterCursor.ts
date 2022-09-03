import { EditorState, ContentBlock } from 'draft-js'

import addRow from './addRow'
import getCursorPositionInTable from './getCursorPositionInTable'

export default function addRowAfterCursor(editorState: EditorState, tableBlock: ContentBlock) {
    const anchorRow = getCursorPositionInTable(editorState.getSelection(), tableBlock, true).row
    const newContentState = addRow(editorState.getCurrentContent(), tableBlock, anchorRow)
    return EditorState.push(editorState, newContentState, 'change-block-data')
}
