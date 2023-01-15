import { EditorState, ContentBlock } from 'draft-js'

import tableLib from '../lib'
import { addCol } from './addCol'

/**
 * Adds a new column to @param tableBlock after selection extracted
 * from @param editorState
 */
export function addColAfterCursor(
    editorState: EditorState,
    tableBlock: ContentBlock
) {
    const selectionState = editorState.getSelection()
    const { row, col } = tableLib.getCursorPositionInTable(
        selectionState,
        tableBlock,
        true
    )
    const newContentState = addCol(
        editorState.getCurrentContent(),
        tableBlock,
        col
    )
    const adjustedOffset = selectionState.getAnchorOffset() + row * 2
    return EditorState.forceSelection(
        EditorState.push(editorState, newContentState, 'change-block-data'),
        selectionState.getAnchorKey() === tableBlock.getKey()
            ? selectionState.merge({
                  anchorOffset: adjustedOffset,
                  focusOffset: adjustedOffset,
              })
            : selectionState
    )
}
