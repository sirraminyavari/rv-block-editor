import { EditorState } from 'draft-js'
import _ from 'lodash'

import { TABLE_CELL_MARKER } from '..'
import { isSelectionInsideOneTable } from './isSelectionInsideOneTable'

export function adjustSelection(incEditorState: EditorState, prevEditorState: EditorState) {
    const selectionStatus = isSelectionInsideOneTable(incEditorState)
    if (!selectionStatus.isSelectionInsideOneTable) return incEditorState
    const { selection: incSelectionState, tableBlock } = selectionStatus
    const prevSelectionState = prevEditorState.getSelection()

    const text = tableBlock.getText()
    const incAnchorOffset = incSelectionState.getAnchorOffset()
    const incFocusOffset = incSelectionState.getFocusOffset()
    const prevAnchorOffset = prevSelectionState.getAnchorOffset()
    const prevFocusOffset = prevSelectionState.getFocusOffset()
    const isIncAnchorOffsetCritical = isCritical(text, incAnchorOffset)
    const isIncFocusOffsetCritical = isCritical(text, incFocusOffset)

    const newSelectionState = (() => {
        if (!isIncAnchorOffsetCritical && !isIncFocusOffsetCritical) return incSelectionState
        if (incSelectionState.isCollapsed()) {
            const adjustedOffset = adjustOffsetDom(getSelection(), incAnchorOffset, text)
            return incSelectionState.merge({
                anchorOffset: adjustedOffset,
                focusOffset: adjustedOffset,
            })
        }
        return incSelectionState.merge({
            anchorOffset: adjustOffsetComp(incAnchorOffset, prevAnchorOffset),
            focusOffset: adjustOffsetComp(incFocusOffset, prevFocusOffset),
        })
    })()

    if (newSelectionState === incSelectionState) return incEditorState

    return EditorState.forceSelection(incEditorState, newSelectionState)
}

const isCritical = (text: string, offset: number) =>
    text[offset] === TABLE_CELL_MARKER.start || text[offset - 1] === TABLE_CELL_MARKER.end

function adjustOffsetDom(domSelection: Selection, offset: number, text: string) {
    const cellElem = domSelection.anchorNode?.parentElement.closest('[data-table-cell]')
    if (!cellElem) return offset
    const cellN = [...cellElem.parentElement.children].indexOf(cellElem)
    const cellBeforeN = text.slice(0, offset).split(TABLE_CELL_MARKER.end).length - 1
    return offset + (cellN >= cellBeforeN ? 1 : -1)
}

const adjustOffsetComp = (incOffset: number, prevOffset: number) => incOffset + 1 * Math.sign(incOffset - prevOffset)
