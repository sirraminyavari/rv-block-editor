import 'draft-js/dist/Draft.css'
import { useState, useRef, useLayoutEffect } from 'react'
import useUiContext from './UiContext'
import getInitialEditorState from './getInitialEditorState'

import BlockEditor from 'BlockEditor'
import editorTheme from './editorTheme.module.scss'
import ConfigControls from './ConfigControls'

import createBasicInlineStylesPlugin from 'Plugins/BasicInlineStyles'
import createParagraphPlugin from 'Plugins/Paragraph'
import createHeadingsPlugin from 'Plugins/Headings'
import createListsPlugin from 'Plugins/Lists'
import createQuotePlugin from 'Plugins/Quote'
import createCodeBlockPlugin from 'Plugins/CodeBlock'


const plugins = [
    createBasicInlineStylesPlugin (),
    createParagraphPlugin (),
    createHeadingsPlugin (),
    createListsPlugin ({ styles: editorTheme }),
    createQuotePlugin (),
    createCodeBlockPlugin ({ styles: editorTheme })
]


export default function App () {
    const [ editorState, setEditorState ] = useState ( getInitialEditorState ( localStorage.getItem ( 'contentPreset' ) || 'empty' ) )
    const { showState, language, direction } = useUiContext ()

    const editorRef = useRef < any > ()
    useLayoutEffect ( () => editorRef.current?.focus (), [] )

    return <>
        <ConfigControls editorState = { editorState } setEditorState = { setEditorState } />
        <BlockEditor
            ref = { editorRef }
            editorState = { editorState } onChange = { setEditorState }
            lang = { language } dir = { direction }
            plugins = { plugins } styles = { editorTheme }
        />
        { showState && <pre children = { JSON.stringify ( editorState, null, 4 ) } /> }
    </>
}
