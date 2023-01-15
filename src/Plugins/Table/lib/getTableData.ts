import { ContentBlock } from 'draft-js'
import { Alignment } from 'BlockEditor'
import getObjData from 'BlockEditor/Lib/getObjData'

/**
 * Gets some general information about @param tableBlock .
 *
 * @returns .blockKey: Key of the block.
 * @returns .data: ContentBlock's data.
 * @returns .rowN: Number of rows.
 * @returns .colN: Number of columns.
 * @returns .alignments: The alignment map of the table block.
 */
export function getTableData(tableBlock: ContentBlock) {
    const blockKey = tableBlock.getKey()
    const data = tableBlock.getData()
    const rowN: number = data.get('rowN')
    const colN: number = data.get('colN')
    const alignments: Record<number, Alignment> =
        getObjData(data, 'alignments') || {}
    return { blockKey, data, rowN, colN, alignments }
}
