import { SelectionState } from 'draft-js';

import { RtblSelectionState } from './useRtblSelectionState';

/**
 * Information regarding the Inline Style Menu UI.
 */
export interface InlineStyleMenuInfo {
  // Whether the Inline Style Menu is open
  isOpen: boolean;
  // The native selection object on witch the Inline Style Menu operate
  domSelection?: Selection;
  // @returns The Bounding Rect of @param domSelection
  getSelectionRect?: () => DOMRect | null;
}

export default function useInlineStyleMenu(
  isBlockLevelSelecting: boolean,
  selectionState: SelectionState,
  { domSelection }: RtblSelectionState
): InlineStyleMenuInfo {
  const isOpen =
    !isBlockLevelSelecting &&
    !domSelection.isCollapsed &&
    selectionState.getHasFocus() &&
    (selectionState.getAnchorKey() !== selectionState.getFocusKey() ||
      selectionState.getAnchorOffset() !== selectionState.getFocusOffset());
  return {
    isOpen,
    domSelection,
    getSelectionRect: () =>
      domSelection.isCollapsed
        ? null
        : domSelection?.getRangeAt(0).getBoundingClientRect(),
  };
}
