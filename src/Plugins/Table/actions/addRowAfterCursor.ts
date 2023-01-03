import { EditorState, ContentBlock } from 'draft-js'

import tableLib from '../lib'
import { addRow } from './addRow'

export function addRowAfterCursor(
    editorState: EditorState,
    tableBlock: ContentBlock
) {
    const selectionState = editorState.getSelection()
    const { row } = tableLib.getCursorPositionInTable(
        selectionState,
        tableBlock,
        true
    )
    const newContentState = addRow(
        editorState.getCurrentContent(),
        tableBlock,
        row
    )
    return EditorState.forceSelection(
        EditorState.push(editorState, newContentState, 'change-block-data'),
        selectionState
    )
}
