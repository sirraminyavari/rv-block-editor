import { TABLE_CELL_MARKER } from '..'

export function getOffsetPositionsInTable(
    offset: number,
    colN: number,
    text: string
) {
    const cell = text.slice(0, offset).split(TABLE_CELL_MARKER.end).length - 1
    const row = Math.floor(cell / colN)
    const col = cell % colN
    return { cell, row, col }
}
