import { EditorState, Modifier } from 'draft-js'
import _ from 'lodash'

import tableLib from './lib'
import { TABLE_CELL_MARKER } from '.'

export default function stateTransformer(
    incEditorState: EditorState,
    prevEditorState: EditorState
) {
    return _.chain(incEditorState)
        .thru(incEditorState => adjustMarkers(incEditorState))
        .thru(incEditorState =>
            tableLib.adjustSelection(incEditorState, prevEditorState)
        )
        .value()
}

function adjustMarkers(incEditorState: EditorState): EditorState {
    const lastChangeType = incEditorState.getLastChangeType()
    if (
        !['backspace-character', 'delete-character', 'remove-range'].includes(
            lastChangeType
        )
    )
        return incEditorState
    const selectionStatus = tableLib.isSelectionInsideOneTable(incEditorState)
    if (!selectionStatus.isSelectionInsideOneTable) return incEditorState
    const { tableBlock, selection } = selectionStatus
    const { rowN, colN } = tableLib.getTableData(tableBlock)
    const cellN = rowN * colN

    const incContentState = incEditorState.getCurrentContent()
    const text = tableBlock.getText()

    const startMarkerN = text.split(TABLE_CELL_MARKER.start).length - 1
    const endMarkerN = text.split(TABLE_CELL_MARKER.end).length - 1
    const totalFullCells = Math.min(startMarkerN, endMarkerN)
    if (totalFullCells >= cellN) return incEditorState

    const fullyRemovedCellsN =
        cellN - totalFullCells - +!!(startMarkerN - endMarkerN)
    const adjustingMarkers =
        (startMarkerN < endMarkerN ? TABLE_CELL_MARKER.start : '') +
        `${TABLE_CELL_MARKER.end}${TABLE_CELL_MARKER.start}`.repeat(
            fullyRemovedCellsN
        ) +
        (startMarkerN > endMarkerN ? TABLE_CELL_MARKER.end : '')

    return EditorState.set(incEditorState, {
        currentContent: Modifier.insertText(
            incContentState,
            // Selection should be collapsed by itself, but we'll make sure anyway!
            selection.merge({ anchorOffset: selection.getFocusOffset() }),
            adjustingMarkers
        ),
    })
}
