import { EditorPlugin } from '../../BlockEditor';

import AlignmentButtons from './AlignmentButtons';

export default function createBlockAlignmentPlugin(): EditorPlugin {
  return {
    id: 'block-alignment',

    inlineStyles: [{ Component: AlignmentButtons }],
  };
}
