import { BlockMap, ContentBlock } from 'draft-js'

// Self Excluded
/**
 * @returns The next block after the provided target which is equal or shallower
 * than a certain depth (self excluded).
 */
export default function getNextEqualOrShallowerBlock(
  blockMap: BlockMap,
  targetKey: string,
  depth: number
): ContentBlock {
  const nextEqualOrShallowerBlock = blockMap
    .skipUntil((_, key) => key === targetKey)
    .skip(1)
    .skipUntil((b) => b.getDepth() <= depth)
    .first()
  return nextEqualOrShallowerBlock
}
