import { EditorState, ContentBlock } from 'draft-js'

import tableLib from '../lib'
import { removeCol } from './removeCol'

/**
 * Removes the column that has the cursor in it from @param tableBlock .
 * Cursor position is extracted from @param editorState .
 */
export function removeColByCursor(
    editorState: EditorState,
    tableBlock: ContentBlock
) {
    const anchorCol = tableLib.getCursorPositionInTable(
        editorState.getSelection(),
        tableBlock,
        true
    ).col
    const newContentState = removeCol(
        editorState.getCurrentContent(),
        tableBlock,
        anchorCol
    )
    return EditorState.push(editorState, newContentState, 'change-block-data')
}
