import { BlockMap } from 'draft-js'

import getSelectionDepth from '../Lib/getSelectionDepth'
import getFirstAncestorByDepth from '../Lib/getFirstAncestorByDepth'
import getLastCousinShallowerThan from '../Lib/getLastCousinShallowerThan'
import getBlockRange from '../Lib/getBlockRange'

/**
 * Calculates the BLS selection range based on the native selection.
 */
export default function blsAwareGetBlockRange(
  blockMap: BlockMap,
  startKey: string,
  endKey: string,
  selectionDepth: number = getSelectionDepth(blockMap, startKey, endKey)
): BlockMap {
  const adjustedStartKey = getFirstAncestorByDepth(
    blockMap,
    startKey,
    selectionDepth
  ).getKey()
  const adjustedEndKey = getLastCousinShallowerThan(
    blockMap,
    endKey,
    selectionDepth
  ).getKey()
  return getBlockRange(blockMap, adjustedStartKey, adjustedEndKey)
}
