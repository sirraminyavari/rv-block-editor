import { EditorState } from 'draft-js'
import _ from 'lodash'

import { Alignment } from 'BlockEditor'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import setBlockData from 'BlockEditor/Lib/setBlockData'
import getObjData from 'BlockEditor/Lib/getObjData'

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

    // FIXME: Spaghetti code
    if (isSelectionInsideOneTable(editorState).isSelectionInsideOneTable) {
        const text = contentBlock.getText()
        const { colN } = getTableData(contentBlock)
        const { cell: anchorCellN } = getOffsetPositionsInTable(selectionState.getAnchorOffset(), colN, text)
        const { cell: focusCellN } = getOffsetPositionsInTable(selectionState.getFocusOffset(), colN, text)
        const [startCellN, endCellN] = [Math.min(anchorCellN, focusCellN), Math.max(anchorCellN, focusCellN)]

        const alignments = (() => {
            const alignments: Record<number, Alignment> = getObjData(currentData, 'alignments') || {}
            const resetAligns = _.chain(alignments)
                .thru(a => _.pickBy(a, (_, i: any) => i >= startCellN && i <= endCellN))
                .thru(a => Object.values(a))
                .thru(a => a.length && a.every(a => a === align))
                .value()
            for (let cellN = startCellN; cellN <= endCellN; cellN++) {
                if (resetAligns) delete alignments[cellN]
                else alignments[cellN] = align
            }
            return alignments
        })()

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
