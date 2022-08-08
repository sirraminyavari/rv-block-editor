import { BlockMap } from 'draft-js'

import getBlockRange from '../Lib/getBlockRange'

/**
 * @returns The depth of the shallowest selected block.
 */
export default function getSelectionDepth(blockMap: BlockMap, startKey: string, endKey: string): number {
    const rawSelectedBlocks = getBlockRange(blockMap, startKey, endKey)
    const selectionDepth = Math.min(...rawSelectedBlocks.map(b => b.getDepth()).toArray())
    return selectionDepth
}
