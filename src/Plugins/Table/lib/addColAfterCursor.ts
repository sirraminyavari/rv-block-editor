import { EditorState, ContentBlock } from 'draft-js'

import addCol from './addCol'
import getCursorPositionInTable from './getCursorPositionInTable'

export default function addColAfterCursor(editorState: EditorState, tableBlock: ContentBlock) {
    const anchorCol = getCursorPositionInTable(editorState.getSelection(), tableBlock, true).col
    const newContentState = addCol(editorState.getCurrentContent(), tableBlock, anchorCol)
    return EditorState.push(editorState, newContentState, 'change-block-data')
}
