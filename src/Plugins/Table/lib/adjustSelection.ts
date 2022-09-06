import { EditorState, SelectionState } from 'draft-js'
import _ from 'lodash'

import { TABLE_CELL_MARKER } from '..'
import { isSelectionInsideOneTable } from './isSelectionInsideOneTable'

export function adjustSelection(editorState: EditorState) {
    const selectionStatus = isSelectionInsideOneTable(editorState)
    if (!selectionStatus.isSelectionInsideOneTable) return editorState
    const { selection, tableBlock } = selectionStatus

    const text = tableBlock.getText()
    const domSelection = getSelection()
    const newSelectionState = _.chain(selection)
        .thru(getOffsetAdjuster(text, domSelection, 'anchor'))
        .thru(getOffsetAdjuster(text, domSelection, 'focus'))
        .value()
    if (newSelectionState === selection) return editorState

    console.log({ old: selection.toJS(), new: newSelectionState.toJS() })

    return EditorState.forceSelection(editorState, newSelectionState)
}

const isCritical = (text: string, offset: number) =>
    text[offset] === TABLE_CELL_MARKER.start || text[offset - 1] === TABLE_CELL_MARKER.end

function adjustOffset(domSelection: Selection, offset: number, text: string) {
    const cellElem = domSelection.anchorNode.parentElement.closest('[data-table-cell]')
    if (!cellElem) return offset

    const cellN = [...cellElem.parentElement.children].indexOf(cellElem)
    const cellBeforeN = text.slice(0, offset).split(TABLE_CELL_MARKER.end).length - 1

    return offset + (cellN >= cellBeforeN ? 1 : -1)
}

const getOffsetAdjuster =
    (text: string, domSelection: Selection, type: 'anchor' | 'focus') => (selection: SelectionState) => {
        const offset: number = selection[`get${_.capitalize(type)}Offset`]()
        if (!isCritical(text, offset)) return selection
        return selection.merge({ [`${type}Offset`]: adjustOffset(domSelection, offset, text) })
    }
