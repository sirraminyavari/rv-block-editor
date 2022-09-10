import { EditorState } from 'draft-js'
import _ from 'lodash'

import { Alignment } from 'BlockEditor'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import setBlockData from 'BlockEditor/Lib/setBlockData'

import { isSelectionInsideOneTable } from 'Plugins/Table/lib/isSelectionInsideOneTable'
import { getTableData } from 'Plugins/Table/lib/getTableData'
import { getOffsetPositionsInTable } from 'Plugins/Table/lib/getOffsetPositionsInTable'

export default function setBlockAlignment(
    align: Alignment,
    editorState: EditorState,
    setEditorState: SetState<EditorState>
) {
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()

    const blockKey = selectionState.getAnchorKey()
    const contentBlock = contentState.getBlockForKey(blockKey)

    const currentData = contentBlock.getData()
    const currentAlignment = currentData.get('_align')

    if (isSelectionInsideOneTable(editorState)) {
        // FIXME: Spaghetti code
        const text = contentBlock.getText()
        const { colN } = getTableData(contentBlock)
        const { cell: ac } = getOffsetPositionsInTable(selectionState.getAnchorOffset(), colN, text)
        const { cell: fc } = getOffsetPositionsInTable(selectionState.getFocusOffset(), colN, text)
        const [sc, ec] = [Math.min(ac, fc), Math.max(ac, fc)]
        const alignments = { ...(currentData.get('alignments')?.toJS() ?? {}) }
        Array.from({ length: ec - sc + 1 })
            .fill(sc)
            .forEach((v: number, i) => {
                const cellN = v + i
                if (alignments[cellN] === align) return delete alignments[cellN]
                alignments[cellN] = align
            })
        const newEditorState = mergeBlockData(editorState, blockKey, { alignments })
        setEditorState(newEditorState)
        return
    }

    const newEditorState =
        currentAlignment === align
            ? setBlockData(editorState, blockKey, _.omit(currentData.toObject(), ['_align']))
            : mergeBlockData(editorState, blockKey, { _align: align })
    setEditorState(newEditorState)
}
