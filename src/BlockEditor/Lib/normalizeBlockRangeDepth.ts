import { BlockMap } from 'draft-js'

import getBlockRange from './getBlockRange'

/**
 * Sets the minimum depth in a fragment of ContentBlocks to 0
 * while keeping all the hierarchical relations intact in that fragment.
 */
export default function normalizeBlockRangeDepth(
  blockMap: BlockMap,
  startKey: string,
  endKey: string
): BlockMap {
  const range = getBlockRange(blockMap, startKey, endKey)
  const minDepth = Math.min(...range.map((b) => b.getDepth()).toArray())
  const normalizedRange = range.map((b) =>
    b.set('depth', b.getDepth() - minDepth)
  ) as BlockMap
  const normalizedBlockMap = blockMap.merge(normalizedRange)
  return normalizedBlockMap
}
