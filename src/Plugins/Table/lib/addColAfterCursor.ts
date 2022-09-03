import { EditorState, ContentBlock } from 'draft-js'

import addCol from './addCol'
import getCursorPositionInTable from './getCursorPositionInTable'

export default function addColAfterCursor(editorState: EditorState, tableBlock: ContentBlock) {
    const anchorCol =
        getCursorPositionInTable(editorState.getSelection(), tableBlock)?.col ?? tableBlock.getData().get('colN') - 1
    const newContentState = addCol(editorState.getCurrentContent(), tableBlock, anchorCol)
    return EditorState.push(editorState, newContentState, 'change-block-data')
}
