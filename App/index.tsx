import 'draft-js/dist/Draft.css'
import { useState, useRef, useLayoutEffect } from 'react'
import { EditorState } from 'draft-js'
import useUiContext from './UiContext'

import BlockEditor from 'BlockEditor'
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
    createListsPlugin (),
    createQuotePlugin (),
    createCodeBlockPlugin ()
]


export default function App () {
    const [ editorState, setEditorState ] = useState ( () => EditorState.createEmpty () )
    const { showState, language, direction } = useUiContext ()

    const editorRef = useRef < any > ()
    useLayoutEffect ( () => editorRef.current?.focus (), [] )

    return <>
        <ConfigControls />
        <BlockEditor
            ref = { editorRef }
            editorState = { editorState } setEditorState = { setEditorState }
            lang = { language } dir = { direction }
            plugins = { plugins }
        />
        { showState && <pre children = { JSON.stringify ( editorState, null, 4 ) } /> }
    </>
}
