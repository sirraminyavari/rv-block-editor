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
    createTextAnnotationsPlugin (),
    createBlockAlignmentPlugin ()
]


export default function App () {
    const [ editorState, setEditorState ] = useState ( getInitialEditorState ( localStorage.getItem ( 'contentPreset' ) || 'empty' ) )
    const { debugMode, readOnly, textarea, language, direction } = useUiContext ()

    const editorRef = useRef < any > ()
    useLayoutEffect ( () => void setImmediate ( () => editorRef.current?.focus () ), [] )

    useAutoSave ( editorState, arg => console.log ( arg ), 1000 )

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
