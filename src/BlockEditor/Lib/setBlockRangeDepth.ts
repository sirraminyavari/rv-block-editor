import { BlockMap } from 'draft-js'

import getBlockRange from './getBlockRange'
import normalizeBlockRangeDepth from './normalizeBlockRangeDepth'

/**
 * Sets the minimum depth in a fragment of ContentBlocks to the provided
 * value while keeping all the hierarchical relations intact in that fragment.
 */
export default function setBlockRangeDepth(
  blockMap: BlockMap,
  startKey: string,
  endKey: string,
  depth: number
): BlockMap {
  const normalizedBlockMap = normalizeBlockRangeDepth(
    blockMap,
    startKey,
    endKey
  )
  const range = getBlockRange(normalizedBlockMap, startKey, endKey)
  const depthAdjustedRange = range.map((b) =>
    b.set('depth', b.getDepth() + depth)
  ) as BlockMap
  const depthAdjustedBlockMap = blockMap.merge(depthAdjustedRange)
  return depthAdjustedBlockMap
}
