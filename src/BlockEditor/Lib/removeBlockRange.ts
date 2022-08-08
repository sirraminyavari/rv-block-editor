import { BlockMap } from 'draft-js'

/**
 * Removes a fragment of ContentBlocks from the BlockMap.
 */
export default function removeBlockRange(blockMap: BlockMap, startKey: string, endKey: string): BlockMap {
    const before = blockMap.takeUntil((_, key) => key === startKey)
    const after = blockMap.skipUntil((_, key) => key === endKey).skip(1)
    const newBlockMap = before.concat(after).toOrderedMap()
    return newBlockMap
}
