import { EditorState } from 'draft-js';

import { mergeBlockDataByKey as _mergeBlockDataByKey } from 'draft-js-modifiers';

/**
 * A wrapper around 'mergeBlockDataByKey' from 'draft-js-modifiers' to hack-solve an issue.
 */
export default function mergeBlockData(
  editorState: EditorState,
  blockKey: string,
  data: Object
) {
  return EditorState.forceSelection(
    _mergeBlockDataByKey(editorState, blockKey, data),
    editorState.getSelection()
  );
}
