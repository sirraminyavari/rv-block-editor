import {
  EditorState,
  convertFromRaw,
  SelectionState,
  ContentState,
  BlockMap,
} from 'draft-js';
import randomizeBlockMapKeys from 'draft-js/lib/randomizeBlockMapKeys';

import getSelectionDepth from '../Lib/getSelectionDepth';
import setBlockRangeDepth from '../Lib/setBlockRangeDepth';

import { ClipboardEventHandler, ClipboardData } from '.';

/**
 * Pastes clipboard data into the editor state while taking block-leve selection
 * into account.
 */
const pasteHandler: ClipboardEventHandler = (
  editor,
  getUiState,
  setEditorState,
  event
) => {
  const { blockLevelSelectionInfo } = getUiState();
  const { getEditorState } = editor;
  const editorState = getEditorState();
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const blockMap = contentState.getBlockMap();

  const pasteData = getPasteData(event);
  if (!pasteData) return;
  const pastedContentState = convertFromRaw(pasteData.rawContent);

  const targetSelectionState = (() => {
    if (!blockLevelSelectionInfo.enabled) {
      const startKey = selectionState.getStartKey();
      const offset = blockMap.get(startKey).getLength();
      return selectionState.merge({
        anchorKey: startKey,
        anchorOffset: offset,
        focusKey: startKey,
        focusOffset: offset,
        isBackward: false,
      });
    }
    const { selectedBlockKeys } = blockLevelSelectionInfo;
    const focusBlock = blockMap.get(
      selectedBlockKeys[selectedBlockKeys.length - 1]
    );
    return selectionState.merge({
      anchorKey: selectedBlockKeys[0],
      focusKey: focusBlock.getKey(),
      anchorOffset: 0,
      focusOffset: focusBlock.getLength(),
      isBackward: false,
    });
  })();

  const pastedBlockMap = pastedContentState.getBlockMap();
  const selectionDepth = getSelectionDepth(
    blockMap,
    targetSelectionState.getStartKey(),
    targetSelectionState.getEndKey()
  );
  const depthAdjustedPastedBlockMap = setBlockRangeDepth(
    pastedBlockMap,
    pastedBlockMap.first().getKey(),
    pastedBlockMap.last().getKey(),
    selectionDepth
  );
  const readyPastedBlockMap = randomizeBlockMapKeys(
    depthAdjustedPastedBlockMap
  ) as BlockMap;

  const newBlockMap = (() => {
    const startKey = targetSelectionState.getStartKey();
    const endKey = targetSelectionState.getEndKey();
    const cutBlockMapLeft = (() => {
      const afterKey = contentState.getKeyAfter(startKey);
      const unsafeLeft = blockMap.takeUntil((_, key) => key === afterKey);
      const safeLeft = unsafeLeft.skipLast(1);
      const blsCorrectedLeft = blockLevelSelectionInfo.enabled
        ? safeLeft
        : unsafeLeft.last().getText()
        ? unsafeLeft
        : safeLeft;
      return blsCorrectedLeft;
    })();
    const cutBlockMapRight = blockMap
      .skipUntil((_, key) => key === endKey)
      .skip(1);
    return cutBlockMapLeft.concat(readyPastedBlockMap, cutBlockMapRight);
  })();
  const newContentState = ContentState.createFromBlockArray(
    newBlockMap.toArray()
  );

  const newSelectionState = (() => {
    const firstBlock = readyPastedBlockMap.first();
    const lastBlock = readyPastedBlockMap.last();
    return new SelectionState({
      anchorKey: firstBlock.getKey(),
      focusKey: lastBlock.getKey(),
      anchorOffset: 0,
      focusOffset: lastBlock.getLength(),
      isBackward: false,
      hasFocus: true,
    });
  })();

  // TODO: Use selectionBefore & selectionAfter instead of forceSelection
  const newEditorState = EditorState.forceSelection(
    EditorState.push(editorState, newContentState, 'insert-fragment'),
    newSelectionState
  );

  event.preventDefault();
  setEditorState(newEditorState);
};
export default pasteHandler;

/**
 * Retrive data from clipboard in an standard way.
 * TODO: Add support for pasting from other softwares. (Paste from MS Word)
 */
function getPasteData(event: ClipboardEvent): ClipboardData | null {
  try {
    const jsonData = JSON.parse(
      event.clipboardData.getData('application/json')
    );
    return jsonData.NEXTLE_blockEditor && jsonData.NEXTLE_blockEditor_BLS
      ? jsonData
      : null;
  } catch {
    return null;
  }
}
