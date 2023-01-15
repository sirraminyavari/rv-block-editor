import { Alignment } from 'BlockEditor'

/**
 * Adjusts the aligments record @param alignments after the @param mode operation @param op
 * has been done and @returns the adjusted alignments.
 */
export function adjustAlignments(
    mode: 'row' | 'col',
    op: 'add' | 'remove',
    alignments: Record<number, Alignment>,
    anchor: number,
    rowN: number,
    colN: number
) {
    const adjuster = { row: adjustAlignmentsRow, col: adjustAlignmentsCol }[
        mode
    ]
    return adjuster(op, alignments, anchor, rowN, colN)
}

const opN = { add: 1, remove: -1 }

/**
 * Adjusts the aligments record @param alignments after the row operation @param op
 * has been done and @returns the adjusted alignments.
 */
function adjustAlignmentsRow(
    op: 'add' | 'remove',
    alignments: Record<number, Alignment>,
    anchorRow: number,
    rowN: number,
    colN: number
) {
    const newAlignments: Record<number, Alignment> = {}
    const criticalPoint = (anchorRow + 1) * colN - 1
    const multiplier = opN[op]
    for (let n = 0, l = rowN * colN; n < l; n++) {
        const currentAlign = alignments[n]
        if (currentAlign)
            newAlignments[n + (n > criticalPoint ? colN * multiplier : 0)] =
                alignments[n]
    }
    return newAlignments
}

/**
 * Adjusts the aligments record @param alignments after the column operation @param op
 * has been done and @returns the adjusted alignments.
 */
function adjustAlignmentsCol(
    op: 'add' | 'remove',
    alignments: Record<number, Alignment>,
    anchorCol: number,
    rowN: number,
    colN: number
) {
    const newAlignments: Record<number, Alignment> = {}
    const modAnchor = anchorCol % colN
    const diff = opN[op]
    for (let n = 0, c = 0, l = rowN * colN; n < l; n++) {
        const modN = n % colN
        const currentAlign = alignments[n]
        if (currentAlign) newAlignments[n + c] = currentAlign
        if (modN === modAnchor) c += diff
    }
    return newAlignments
}
