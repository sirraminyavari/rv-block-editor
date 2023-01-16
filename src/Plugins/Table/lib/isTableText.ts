// TODO: Docs

import { TABLE_CELL_MARKER } from '..'

export const isTableText = (text: string) =>
    text.includes(TABLE_CELL_MARKER.start) ||
    text.includes(TABLE_CELL_MARKER.end)
