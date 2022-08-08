import { EditorState } from 'draft-js'

import { modifyBlockByKey } from 'draft-js-modifiers'

/**
 * Replaces and object as data for a ContentBlock.
 */
export default function setBlockData(
  editorState: EditorState,
  blockKey: string,
  data: Object
) {
  return EditorState.forceSelection(
    modifyBlockByKey(editorState, blockKey, { data }),
    editorState.getSelection()
  )
}
