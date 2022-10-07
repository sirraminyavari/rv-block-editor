import { ContentBlock } from 'draft-js'
import { Alignment } from 'BlockEditor'
import getObjData from 'BlockEditor/Lib/getObjData'

export function getTableData(tableBlock: ContentBlock) {
    const blockKey = tableBlock.getKey()
    const data = tableBlock.getData()
    const rowN: number = data.get('rowN')
    const colN: number = data.get('colN')
    const alignments: Record<number, Alignment> = getObjData(data, 'alignments') || {}
    return { blockKey, data, rowN, colN, alignments }
}
