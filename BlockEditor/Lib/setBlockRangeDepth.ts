import { BlockMap } from 'draft-js'

import getBlockRange from './getBlockRange'


export default function setBlockRangeDepth (
    blockMap: BlockMap,
    startKey: string,
    endKey: string,
    depth: number
): BlockMap {
    const normalizedBlockMap = normalizeBlockRangeDepth ( blockMap, startKey, endKey )
    const range = getBlockRange ( normalizedBlockMap, startKey, endKey )
    const depthAdjustedRange = range.map ( b => b.set ( 'depth', b.getDepth () + depth ) ) as BlockMap
    const depthAdjustedBlockMap = blockMap.merge ( depthAdjustedRange )
    return depthAdjustedBlockMap
}

function normalizeBlockRangeDepth (
    blockMap: BlockMap,
    startKey: string,
    endKey: string
): BlockMap {
    const range = getBlockRange ( blockMap, startKey, endKey )
    const minDepth = Math.min ( ...range.map ( b => b.getDepth () ).toArray () )
    const normalizedRange = range.map ( b => b.set ( 'depth', b.getDepth () - minDepth ) ) as BlockMap
    const normalizedBlockMap = blockMap.merge ( normalizedRange )
    return normalizedBlockMap
}
