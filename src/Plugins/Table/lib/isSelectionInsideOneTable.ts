import { EditorState } from 'draft-js'

export function isSelectionInsideOneTable(editorState: EditorState) {
    const falsy = { isSelectionInsideOneTable: false as const }
    const selection = editorState.getSelection()
    const anchorKey = selection.getAnchorKey()
    if (anchorKey !== selection.getFocusKey()) return falsy
    const block = editorState.getCurrentContent().getBlockForKey(anchorKey)
    if (block.getType() !== 'table') return falsy
    return {
        isSelectionInsideOneTable: true as const,
        selection,
        tableBlock: block,
    }
}
