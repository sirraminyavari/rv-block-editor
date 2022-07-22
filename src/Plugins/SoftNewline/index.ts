import { EditorState, RichUtils, Modifier } from 'draft-js';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';

import { EditorPlugin } from '../../BlockEditor';

export default function createSoftNewlinePlugin(): EditorPlugin {
  return {
    id: 'softnewline',

    handleReturn(event, editorState, { setEditorState }) {
      if (!isSoftNewlineEvent(event)) return 'not-handled';

      const selectionState = editorState.getSelection();
      if (selectionState.isCollapsed()) {
        setEditorState(RichUtils.insertSoftNewline(editorState));
        return 'handled';
      }

      const contentState = editorState.getCurrentContent();
      const contentWithoutSelectedText = Modifier.removeRange(
        contentState,
        selectionState,
        'forward'
      );
      const newSelection = contentWithoutSelectedText.getSelectionAfter();
      const newBlock = contentWithoutSelectedText.getBlockForKey(
        newSelection.getStartKey()
      );

      const newContent = Modifier.insertText(
        contentWithoutSelectedText,
        newSelection,
        '\n',
        newBlock.getInlineStyleAt(newSelection.getStartOffset()),
        null
      );

      setEditorState(
        EditorState.push(editorState, newContent, 'insert-fragment')
      );
      return 'handled';
    },
  };
}
