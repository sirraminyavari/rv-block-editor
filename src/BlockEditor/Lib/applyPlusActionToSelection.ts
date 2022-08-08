import { EditorState, ContentState, ContentBlock, RichUtils } from 'draft-js'
import { getSelectedBlock } from 'draftjs-utils'

/**
 * Toggles the specified Plus Action on the Content Block that the cursor resides on.
 *
 * @param editorState - Current Editor State.
 * @param plusAction - The Plus Action to be toggled.
 *
 * @returns A new Editor State with the specified Plus Action toggled.
 */
export default function applyPlusActionToSelection(
  editorState: EditorState,
  plusAction: string
): EditorState {
  const selectedBlock = getSelectedBlock(editorState) as ContentBlock
  const selectedBlockKey = selectedBlock.getKey()

  const editorStateAfterPlusAction = RichUtils.toggleBlockType(
    editorState,
    plusAction
  )
  const alteredContentState = editorStateAfterPlusAction.getCurrentContent()
  const alteredSelectedBlock =
    alteredContentState.getBlockForKey(selectedBlockKey)

  const depthAdjustedSelectedBlock = alteredSelectedBlock.set(
    'depth',
    selectedBlock.getDepth()
  ) as ContentBlock
  const depthAdjustedContentState = alteredContentState.merge({
    blockMap: alteredContentState
      .getBlockMap()
      .set(selectedBlockKey, depthAdjustedSelectedBlock),
  }) as ContentState

  return EditorState.push(
    editorState,
    depthAdjustedContentState,
    'change-block-type'
  )
}
