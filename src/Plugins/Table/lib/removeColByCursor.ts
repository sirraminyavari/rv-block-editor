import { EditorState, ContentBlock } from 'draft-js'

import removeCol from './removeCol'
import getCursorPositionInTable from './getCursorPositionInTable'

export default function removeColByCursor(editorState: EditorState, tableBlock: ContentBlock) {
    const anchorCol = getCursorPositionInTable(editorState.getSelection(), tableBlock, true).col
    const newContentState = removeCol(editorState.getCurrentContent(), tableBlock, anchorCol)
    return EditorState.push(editorState, newContentState, 'change-block-data')
}
