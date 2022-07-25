import { DropTarget } from '.';

/**
 * Calculates the minimum valid depth for dropping based on the adjacent blocks.
 */
export function calcMinDepth(dropTarget?: DropTarget) {
  if (!dropTarget) return null;
  const { insertionMode, contentBlock, nextPosInfo } = dropTarget;
  if (!insertionMode) return null;
  return {
    before: () => Math.max(0, contentBlock?.getDepth() - 1) || 0,
    after: () => Math.max(0, nextPosInfo?.contentBlock.getDepth() - 1) || 0,
  }[insertionMode]();
}

/**
 * Calculates the maximum valid depth for dropping based on the adjacent blocks.
 */
export function calcMaxDepth(dropTarget?: DropTarget) {
  if (!dropTarget) return null;
  const { insertionMode, contentBlock, prevPosInfo } = dropTarget;
  if (!insertionMode) return null;
  return {
    before: () => prevPosInfo?.contentBlock.getDepth() + 1 || 0,
    after: () => contentBlock.getDepth() + 1,
  }[insertionMode]();
}
