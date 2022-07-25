import { MutableRefObject } from 'react';
import {
  EditorState,
  ContentState,
  SelectionState,
  DraftInsertionType,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';

import { BlockLevelSelectionInfo } from '../Contexts/UiContext';

import setBlockRangeDepth from '../Lib/setBlockRangeDepth';
import moveBlockRange from '../Lib/moveBlockRange';
import getDragRange from './getDragRange';
import getBlockRange from '../Lib/getBlockRange';
import trimCollapsedBlocks from '../Lib/trimCollapsedBlocks';

/**
 * Handles drop operation which consists of moving the dragged fragment
 * and adjusting its depth.
 */
export default function handleDrop(
  editorRef: MutableRefObject<Editor>,
  editorState: EditorState,
  blockLevelSelectionInfo: BlockLevelSelectionInfo,
  draggedBlockKey: string,
  sector: number,
  dropTargetKey: string,
  insertionMode: DraftInsertionType
): EditorState {
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();

  const { startKey, endKey } = getDragRange(
    blockMap,
    blockLevelSelectionInfo,
    draggedBlockKey
  );
  const depthAdjustedBlockMap = setBlockRangeDepth(
    blockMap,
    startKey,
    endKey,
    sector
  );
  const movedBlockMap = moveBlockRange(
    depthAdjustedBlockMap,
    startKey,
    endKey,
    dropTargetKey,
    insertionMode
  );

  const { anchorKey, focusKey, focusOffset } = (() => {
    const range = getBlockRange(movedBlockMap, startKey, endKey);
    const trimmedRange = trimCollapsedBlocks(range);
    const focusBlock = trimmedRange.last();
    return {
      anchorKey: trimmedRange.first().getKey(),
      focusKey: focusBlock.getKey(),
      focusOffset: focusBlock.getLength(),
    };
  })();
  const selection = new SelectionState({
    anchorKey,
    focusKey,
    anchorOffset: 0,
    focusOffset,
    isBackward: false,
    hasFocus: true,
  });

  const newContentState = contentState.merge({
    blockMap: movedBlockMap,
    selectionBefore: editorState.getSelection(),
    selectionAfter: selection,
  }) as ContentState;

  // This is a tof to fix the issue of the hiding caret in firefox.
  setImmediate(() => {
    editorRef.current?.blur();
    editorRef.current?.focus();
  });

  return EditorState.push(editorState, newContentState, 'move-block');
}
