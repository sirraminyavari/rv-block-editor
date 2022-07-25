import { BlockMap, BlockMapBuilder } from 'draft-js';

import getLastCousinShallowerThan from '../Lib/getLastCousinShallowerThan';

/**
 * Removes all collapes blocks from a BlockMap.
 */
export default function trimCollapsedBlocks(blockMap: BlockMap): BlockMap {
  if (!blockMap.size) return blockMap;
  const safeLeft = blockMap.takeUntil((b) =>
    b.getData().get('_collapsed')
  ) as BlockMap;
  const lastSafeBlockKey = safeLeft.last()?.getKey();
  const right = lastSafeBlockKey
    ? (blockMap
        .skipUntil((_, key) => key === lastSafeBlockKey)
        .skip(1) as BlockMap)
    : blockMap; // It means that the first block is collapsed so safeLeft is empty so lastSafeBlockKey is undefined
  const firstCollapsedBlock = right.first();
  if (!firstCollapsedBlock?.getData().get('_collapsed')) return safeLeft;
  const lastCollapsedKey = getLastCousinShallowerThan(
    right,
    firstCollapsedBlock.getKey(),
    firstCollapsedBlock.getDepth()
  ).getKey();
  const rest = blockMap
    .skipUntil((_, key) => key === lastCollapsedKey)
    .skip(1) as BlockMap;
  return safeLeft.merge(
    BlockMapBuilder.createFromArray([firstCollapsedBlock]),
    trimCollapsedBlocks(rest)
  );
}
