import { BlockMap } from 'draft-js';

import { BlockLevelSelectionInfo } from '../Contexts/UiContext';
import blsAwareGetBlockRange from '../Lib/blsAwareGetBlockRange';

interface DragRange {
  startKey: string;
  endKey: string;
}

/**
 * Calculates the range that user intends to drag with BLS taken into account.
 */
export default function getDragRange(
  blockMap: BlockMap,
  {
    enabled: blsEnabled,
    selectionDepth,
    selectedBlockKeys,
  }: BlockLevelSelectionInfo,
  draggedBlockKey: string
): DragRange {
  const block = blockMap.get(draggedBlockKey);
  const blockDepth = block.getDepth();

  if (blsEnabled && blockDepth === selectionDepth)
    return {
      startKey: selectedBlockKeys[0],
      endKey: selectedBlockKeys[selectedBlockKeys.length - 1],
    };

  const range = blsAwareGetBlockRange(
    blockMap,
    draggedBlockKey,
    draggedBlockKey,
    blockDepth
  );
  return {
    startKey: range.first().getKey(),
    endKey: range.last().getKey(),
  };
}
