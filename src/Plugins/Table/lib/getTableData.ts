import { ContentBlock } from 'draft-js'

export function getTableData(tableBlock: ContentBlock) {
    const blockKey = tableBlock.getKey()
    const data = tableBlock.getData()
    const rowN = data.get('rowN') as number
    const colN = data.get('colN') as number
    return { blockKey, data, rowN, colN }
}
