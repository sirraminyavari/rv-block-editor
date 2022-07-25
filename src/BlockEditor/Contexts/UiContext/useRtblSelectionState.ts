import { useState, useEffect, useCallback } from 'react';
import { ContentState, SelectionState } from 'draft-js';

// * Real-Time Block-Level Selection State
export interface RtblSelectionState {
  domSelection: Selection;
  anchorKey: string;
  focusKey: string;
  startKey: string;
  endKey: string;
  // isBackward only takes blocks into account and is false for any in-block selection
  isBackward: boolean;
}

const defaultRtblSelectionState: RtblSelectionState = {
  domSelection: getSelection(),
  anchorKey: '',
  focusKey: '',
  startKey: '',
  endKey: '',
  isBackward: false,
};

/**
 * Provides all of the required functionality to calculate and store RTBL selection.
 */
export default function useRtblSelectionState(
  contentState: ContentState,
  selectionState: SelectionState,
  disable: boolean
): [RtblSelectionState, () => void] {
  const [rtblSelectionState, setRtblSelectionState] = useState(
    defaultRtblSelectionState
  );

  const updateRtblSelectionState = useCallback(
    () => setRtblSelectionState(calcRtblSelectionState(contentState)),
    [contentState]
  );

  const hasFocus = selectionState.getHasFocus();
  useEffect(() => {
    if (disable || !hasFocus) return;
    document.addEventListener('selectionchange', updateRtblSelectionState);
    return () =>
      document.removeEventListener('selectionchange', updateRtblSelectionState);
  }, [disable, hasFocus, contentState]);

  return [rtblSelectionState, updateRtblSelectionState];
}

export function calcRtblSelectionState(
  contentState: ContentState
): RtblSelectionState {
  const domSelection = getSelection();
  if (
    domSelection.isCollapsed ||
    !domSelection.anchorNode ||
    !domSelection.focusNode
  )
    return defaultRtblSelectionState;
  const anchorKey = getParentBlockKey(domSelection.anchorNode);
  const focusKey = getParentBlockKey(domSelection.focusNode);
  const isBackward = calcIsBackward(contentState, anchorKey, focusKey);
  return {
    domSelection,
    anchorKey,
    focusKey,
    isBackward,
    startKey: isBackward ? focusKey : anchorKey,
    endKey: isBackward ? anchorKey : focusKey,
  };
}

export function getParentBlockKey(node: Node): string | null {
  const parentBlock = node.parentElement.closest('[data-block-key]');
  if (!parentBlock) return null;
  const blockKey = parentBlock.getAttribute('data-block-key');
  return blockKey;
}

export function calcIsBackward(
  contentState: ContentState,
  anchorKey: string,
  focusKey: string
) {
  if (!anchorKey || !focusKey) return false;
  if (anchorKey === focusKey) return false;
  const blockMap = contentState.getBlockMap();
  const startKey = blockMap
    .find((_, key) => key === anchorKey || key === focusKey)
    ?.getKey();
  const isBackward = anchorKey !== startKey;
  return isBackward;
}
