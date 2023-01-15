import { EditorState, Modifier } from 'draft-js'
import _ from 'lodash'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'

import tableLib from './lib'
import { TABLE_CELL_MARKER } from '.'

/**
 * Initializes a newly created table block with the necessary table markers.
 */
export function initialStateTransformer(
    initialRowN: number,
    initialColN: number,
    editorState: EditorState
) {
    const selectionState = editorState.getSelection()
    const newContentState = _.chain(editorState.getCurrentContent())
        .thru(contentState =>
            mergeBlockData(
                EditorState.createWithContent(contentState),
                selectionState.getAnchorKey(),
                {
                    rowN: initialRowN,
                    colN: initialColN,
                }
            ).getCurrentContent()
        )
        .thru(contentState =>
            Modifier.insertText(
                contentState,
                editorState
                    .getSelection()
                    .merge({ anchorOffset: 0, focusOffset: 0 }),
                `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`.repeat(
                    initialRowN * initialColN
                )
            )
        )
        .value()
    return EditorState.forceSelection(
        EditorState.set(editorState, {
            currentContent: newContentState,
        }),
        selectionState.merge({
            anchorOffset: 1,
            focusOffset: 1,
        })
    )
}

/**
 * Makes sure that table text and selection is always valid.
 */
export function continousStateTransformer(
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

/**
 * Adjusts table markers in accordance with EditorState's last change.
 */
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
