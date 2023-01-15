import { ContentState, SelectionState, Modifier } from 'draft-js'
import _ from 'lodash'

import { TABLE_CELL_MARKER } from '..'

// TODO: Docs
const getRangeMarkers = (text: string, selectionState: SelectionState) =>
    [
        ...text.slice(
            selectionState.getStartOffset(),
            selectionState.getEndOffset()
        ),
    ]
        .filter(
            c =>
                [TABLE_CELL_MARKER.start, TABLE_CELL_MARKER.end].indexOf(c) >= 0
        )
        .join('')

// TODO: Docs
const moveSelection = (selectionState: SelectionState, n: number) =>
    selectionState.merge({
        anchorOffset: selectionState.getAnchorOffset() + n,
        focusOffset: selectionState.getFocusOffset() + n,
    })

/**
 * TODO: Docs
 *
 * * Only use when the whole selection is inside 1 table
 */
export function insertText(
    contentState: ContentState,
    selectionState: SelectionState,
    text: string
) {
    const tableBlock = contentState.getBlockForKey(
        selectionState.getAnchorKey()
    )
    const origText = tableBlock.getText()
    const markers = getRangeMarkers(origText, selectionState)
    const newText = selectionState.getIsBackward()
        ? markers + text
        : text + markers
    return Modifier.replaceText(contentState, selectionState, newText)
}

/**
 * TODO: Docs
 *
 * * Only use when the whole selection is inside 1 table
 */
export function removeRange(
    contentState: ContentState,
    selectionState: SelectionState,
    direction: 'forward' | 'backward'
) {
    const tableBlock = contentState.getBlockForKey(
        selectionState.getAnchorKey()
    )
    const origText = tableBlock.getText()
    const markers = getRangeMarkers(origText, selectionState)
    return _.chain(contentState)
        .thru(contentState => {
            const offset =
                selectionState[
                    { forward: 'getStartOffset', backward: 'getEndOffset' }[
                        direction
                    ]
                ]()
            const newContentState = Modifier.insertText(
                contentState,
                selectionState.merge({
                    anchorOffset: offset,
                    focusOffset: offset,
                }),
                markers
            )
            const removalRange = moveSelection(
                selectionState,
                { forward: markers.length, backward: 0 }[direction]
            )
            return [newContentState, removalRange]
        })
        .thru(([contentState, removalRange]: any) =>
            Modifier.removeRange(contentState, removalRange, direction)
        )
        .value()
}
