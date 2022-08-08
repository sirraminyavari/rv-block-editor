import {
  EditorState,
  SelectionState,
  ContentState,
  BlockMapBuilder,
} from 'draft-js'

import { BlockLevelSelectionInfo } from '../Contexts/UiContext'

import removeBlockRange from './removeBlockRange'
import createEmptyBlock from './createEmptyBlock'
import trimCollapsedBlocks from './trimCollapsedBlocks'

/**
 * Delete a fragment from editor state with BLS taken into account.
 */
export default function blsAwareDelete(
  editorState: EditorState,
  blsInfo: BlockLevelSelectionInfo
): EditorState {
  const contentState = editorState.getCurrentContent()
  const blockMap = contentState.getBlockMap()

  const newBlockMap = (() => {
    const blockMapWithoutRange = removeBlockRange(
      blockMap,
      blsInfo.selectedBlockKeys[0],
      blsInfo.selectedBlockKeys[blsInfo.selectedBlockKeys.length - 1]
    )
    if (blockMapWithoutRange.size) return blockMapWithoutRange
    return BlockMapBuilder.createFromArray([createEmptyBlock()])
  })()

  const firstSelectedBlockKey = blsInfo.selectedBlockKeys[0]
  const anchorBlock =
    trimCollapsedBlocks(blockMap)
      .takeUntil((_, key) => key === firstSelectedBlockKey)
      .last() || newBlockMap.first()
  const anchorBlockKey = anchorBlock.getKey()
  const anchorBlockLength = anchorBlock.getLength()
  const newSelectionState = new SelectionState({
    anchorKey: anchorBlockKey,
    focusKey: anchorBlockKey,
    anchorOffset: anchorBlockLength,
    focusOffset: anchorBlockLength,
    isBackward: false,
    hasFocus: true,
  })

  const newContentState = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: editorState.getSelection(),
    selectionAfter: newSelectionState,
  }) as ContentState
  const newEditorState = EditorState.forceSelection(
    EditorState.push(editorState, newContentState, 'remove-range'),
    newSelectionState
  )
  return newEditorState
}
