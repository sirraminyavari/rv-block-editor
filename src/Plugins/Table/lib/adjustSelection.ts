import { EditorState } from 'draft-js'

import { TABLE_CELL_MARKER } from '..'
import { isSelectionInsideOneTable } from './isSelectionInsideOneTable'

/**
 * Adjusts the SelectionState of @param incomingEditorState in a way that
 * neighter anchorOffset nor focusOffset is critical.
 */
export function adjustSelection(
    incEditorState: EditorState,
    prevEditorState: EditorState
) {
    const incContentState = incEditorState.getCurrentContent()
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
        if (!isIncAnchorOffsetCritical && !isIncFocusOffsetCritical)
            return incSelectionState

        if (incFocusOffset === 0) {
            if (prevFocusOffset !== 1)
                return incSelectionState.merge({
                    focusOffset: 1,
                })
            const prevBlock = incContentState.getBlockBefore(
                tableBlock.getKey()
            )
            if (!prevBlock) return incSelectionState.merge({ focusOffset: 1 })
            return incSelectionState.merge({
                focusKey: prevBlock.getKey(),
                focusOffset: prevBlock.getText().length,
            })
        } else if (incFocusOffset === text.length) {
            if (prevFocusOffset !== text.length - 1)
                return incSelectionState.merge({
                    focusOffset: incFocusOffset - 1, // === text.length - 1
                })
            const nextBlock = incContentState.getBlockAfter(tableBlock.getKey())
            if (!nextBlock)
                return incSelectionState.merge({
                    focusOffset: text.length - 1,
                })
            return incSelectionState.merge({
                focusKey: nextBlock.getKey(),
                focusOffset: 0,
            })
        }

        return incSelectionState.merge({
            anchorOffset: adjustOffset(incAnchorOffset, prevAnchorOffset),
            focusOffset: adjustOffset(incFocusOffset, prevFocusOffset),
        })
    })()

    if (newSelectionState === incSelectionState) return incEditorState

    return EditorState.forceSelection(incEditorState, newSelectionState)
}

/**
 * Detects whether @param offset in @param text is critical i.e.
 * in the wrong place relative to the table markers.
 */
const isCritical = (text: string, offset: number) =>
    text[offset] === TABLE_CELL_MARKER.start ||
    text[offset - 1] === TABLE_CELL_MARKER.end

/**
 * Adjusts a critical offset.
 */
const adjustOffset = (incOffset: number, prevOffset: number) =>
    incOffset + Math.sign(incOffset - prevOffset)

/**
 * Adjusts table selection on critical points according to @param domSelection .
 * ! This function is not currently used anywhere.
 */
export default function adjustOffsetDom(
    domSelection: Selection,
    offset: number,
    text: string
) {
    const cellElem =
        domSelection.anchorNode?.parentElement.closest('[data-table-cell]')
    if (!cellElem) return offset
    const cellN = [...cellElem.parentElement.children].indexOf(cellElem)
    const cellBeforeN =
        text.slice(0, offset).split(TABLE_CELL_MARKER.end).length - 1
    return offset + (cellN >= cellBeforeN ? 1 : -1)
}
