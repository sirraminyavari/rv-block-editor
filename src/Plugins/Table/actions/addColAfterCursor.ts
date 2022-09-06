import { EditorState, ContentBlock } from 'draft-js'

import tableLib from '../lib'
import { addCol } from './addCol'

export function addColAfterCursor(editorState: EditorState, tableBlock: ContentBlock) {
    const anchorCol = tableLib.getCursorPositionInTable(editorState.getSelection(), tableBlock, true).col
    const newContentState = addCol(editorState.getCurrentContent(), tableBlock, anchorCol)
    return EditorState.push(editorState, newContentState, 'change-block-data')
}
