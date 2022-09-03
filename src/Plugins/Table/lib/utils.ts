import { ContentBlock } from 'draft-js'

export function getTableData(tableBlock: ContentBlock) {
    const blockKey = tableBlock.getKey()
    const data = tableBlock.getData()
    const rowN = data.get('rowN') as number
    const colN = data.get('colN') as number
    return { blockKey, rowN, colN }
}

export const sumSegments = (segments: string[]) => segments.reduce((a, v) => a + v.length + 1, 0)
