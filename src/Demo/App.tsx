import 'draft-js/dist/Draft.css';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'BlockEditor/global.scss';

import { useState, useRef, useLayoutEffect } from 'react';
import useUiContext from './UiContext';
import getInitialEditorState from './getInitialEditorState';

import BlockEditor, { defaultTheme } from 'BlockEditor';
import ConfigControls from './ConfigControls';

import * as _plugins from 'Plugins';

import useAutoSave from './useAutoSave';
import mentions from './data/mentions';
import dict from './dict';

const textColors = [
  { name: 'red', color: '#D32F2F' },
  { name: 'purple', color: '#7B1FA2' },
  { name: 'blue', color: '#1976D2' },
  { name: 'cyan', color: '#0097A7' },
  { name: 'green', color: '#388E3C' },
  { name: 'yellow', color: '#FBC02D' },
  { name: 'orange', color: '#E64A19' },
  { name: 'brown', color: '#5D4037' },
];

const highlightColors = [
  { name: 'red', color: '#FFCDD2' },
  { name: 'purple', color: '#E1BEE7' },
  { name: 'blue', color: '#BBDEFB' },
  { name: 'cyan', color: '#B2EBF2' },
  { name: 'green', color: '#C8E6C9' },
  { name: 'yellow', color: '#FFF9C4' },
  { name: 'orange', color: '#FFCCBC' },
  { name: 'brown', color: '#D7CCC8' },
];

const plugins = [
  _plugins.createBasicInlineStylesPlugin(),
  _plugins.createParagraphPlugin(),
  _plugins.createHeadingsPlugin(),
  _plugins.createListsPlugin({ styles: defaultTheme }),
  _plugins.createCheckableListPlugin({ styles: defaultTheme }),
  _plugins.createAccordionPlugin(),
  _plugins.createQuotePlugin(),
  _plugins.createCodeBlockPlugin({ styles: defaultTheme }),
  _plugins.createSoftNewlinePlugin(),
  _plugins.createLinksPlugin(),
  _plugins.createTextAnnotationsPlugin({ textColors, highlightColors }),
  _plugins.createBlockAlignmentPlugin(),
  _plugins.createMentionPlugin({ mentions }),
];

export default function App() {
  const [editorState, setEditorState] = useState(
    getInitialEditorState(localStorage.getItem('contentPreset') || 'empty')
  );
  const { debugMode, readOnly, textarea, language, direction } = useUiContext();

  const editorRef = useRef<any>();
  useLayoutEffect(
    () => void setImmediate(() => editorRef.current?.focus()),
    []
  );

  useAutoSave(
    editorState,
    (changes) =>
      console.log(
        ...['updatedBlocks', 'createdBlocks', 'removedBlocks'].map((key) =>
          changes[key].map((_, key) => key).toArray()
        )
      ),
    1000
  );

  return (
    <>
      <ConfigControls
        editorState={editorState}
        setEditorState={setEditorState}
      />
      <BlockEditor
        ref={editorRef}
        editorState={editorState}
        onChange={setEditorState}
        dict={dict}
        lang={language}
        dir={direction}
        plugins={plugins}
        styles={defaultTheme}
        portalNode={document.getElementById('block-editor-portal')}
        debugMode={debugMode}
        readOnly={readOnly}
        textarea={textarea}
      />
    </>
  );
}
