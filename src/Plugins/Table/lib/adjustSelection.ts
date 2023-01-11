import { EditorState } from 'draft-js'

import { TABLE_CELL_MARKER } from '..'
import { isSelectionInsideOneTable } from './isSelectionInsideOneTable'

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

        // if (incSelectionState.isCollapsed()) {
        //     const adjustedOffset = incFocusOffset + Math.sign ( incFocusOffset - prevFocusOffset )
        //     return incSelectionState.merge({
        //         anchorOffset: adjustedOffset,
        //         focusOffset: adjustedOffset,
        //     })
        // }

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
            anchorOffset: adjustOffsetComparative(
                incAnchorOffset,
                prevAnchorOffset
            ),
            focusOffset: adjustOffsetComparative(
                incFocusOffset,
                prevFocusOffset
            ),
        })
    })()

    if (newSelectionState === incSelectionState) return incEditorState

    return EditorState.forceSelection(incEditorState, newSelectionState)
}

const isCritical = (text: string, offset: number) =>
    text[offset] === TABLE_CELL_MARKER.start ||
    text[offset - 1] === TABLE_CELL_MARKER.end

// function adjustOffsetDom(
//     domSelection: Selection,
//     offset: number,
//     text: string
// ) {
//     const cellElem = domSelection.anchorNode?.parentElement.closest('[data-table-cell]')
//     if (!cellElem) return offset
//     const cellN = [...cellElem.parentElement.children].indexOf(cellElem)
//     const cellBeforeN =
//         text.slice(0, offset).split(TABLE_CELL_MARKER.end).length - 1
//     return offset + (cellN >= cellBeforeN ? 1 : -1)
// }

const adjustOffsetComparative = (incOffset: number, prevOffset: number) =>
    incOffset + Math.sign(incOffset - prevOffset)
