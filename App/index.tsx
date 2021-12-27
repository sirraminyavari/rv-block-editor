import 'draft-js/dist/Draft.css'
import 'react-perfect-scrollbar/dist/css/styles.css'
import 'BlockEditor/global.scss'

import { useState, useRef, useLayoutEffect } from 'react'
import useUiContext from './UiContext'
import getInitialEditorState from './getInitialEditorState'

import BlockEditor from 'BlockEditor'
import editorTheme from './editorTheme.module.scss'
import ConfigControls from './ConfigControls'

import useAutoSave from './useAutoSave'

import createBasicInlineStylesPlugin from 'Plugins/BasicInlineStyles'
import createParagraphPlugin from 'Plugins/Paragraph'
import createHeadingsPlugin from 'Plugins/Headings'
import createListsPlugin from 'Plugins/Lists'
import createCheckableListPlugin from 'Plugins/CheckableList'
import createAccordionPlugin from 'Plugins/Accordion'
import createQuotePlugin from 'Plugins/Quote'
import createCodeBlockPlugin from 'Plugins/CodeBlock'
import createSoftNewlinePlugin from 'Plugins/SoftNewline'
import createLinksPlugin from 'Plugins/Links'
import createTextAnnotationsPlugin from 'Plugins/TextAnnotations'
import createBlockAlignmentPlugin from 'Plugins/BlockAlignment'
import createMentionPlugin from 'Plugins/Mention'

import mentions from './data/mentions'

import dict from './dict'


const plugins = [
    createBasicInlineStylesPlugin (),
    createParagraphPlugin (),
    createHeadingsPlugin (),
    createListsPlugin ({ styles: editorTheme }),
    createCheckableListPlugin ({ styles: editorTheme }),
    createAccordionPlugin (),
    createQuotePlugin (),
    createCodeBlockPlugin ({ styles: editorTheme }),
    createSoftNewlinePlugin (),
    createLinksPlugin (),
    createTextAnnotationsPlugin ({
        textColors: [
            { name: 'red', color: '#D32F2F' },
            { name: 'purple', color: '#7B1FA2' },
            { name: 'blue', color: '#1976D2' },
            { name: 'cyan', color: '#0097A7' },
            { name: 'green', color: '#388E3C' },
            { name: 'yellow', color: '#FBC02D' },
            { name: 'orange', color: '#E64A19' },
            { name: 'brown', color: '#5D4037' },
        ],
        highlightColors: [
            { name: 'red', color: '#FFCDD2' },
            { name: 'purple', color: '#E1BEE7' },
            { name: 'blue', color: '#BBDEFB' },
            { name: 'cyan', color: '#B2EBF2' },
            { name: 'green', color: '#C8E6C9' },
            { name: 'yellow', color: '#FFF9C4' },
            { name: 'orange', color: '#FFCCBC' },
            { name: 'brown', color: '#D7CCC8' },
        ]
    }),
    createBlockAlignmentPlugin (),
    createMentionPlugin ({ mentions })
]


export default function App () {
    const [ editorState, setEditorState ] = useState ( getInitialEditorState ( localStorage.getItem ( 'contentPreset' ) || 'empty' ) )
    const { debugMode, readOnly, textarea, language, direction } = useUiContext ()

    const editorRef = useRef < any > ()
    useLayoutEffect ( () => void setImmediate ( () => editorRef.current?.focus () ), [] )

    useAutoSave ( editorState, changes => console.log (
        ...[ 'updatedBlocks', 'createdBlocks', 'removedBlocks' ].map (
            key => changes [ key ].map ( ( _, key ) => key ).toArray ()
        )
    ), 1000 )

    return <>
        <ConfigControls editorState = { editorState } setEditorState = { setEditorState } />
        <BlockEditor
            ref = { editorRef }
            editorState = { editorState } onChange = { setEditorState }
            dict = { dict } lang = { language } dir = { direction }
            plugins = { plugins } styles = { editorTheme }
            portalNode = { document.getElementById ( 'block-editor-portal' ) }
            debugMode = { debugMode }
            readOnly = { readOnly }
            textarea = { textarea }
        />
    </>
}
