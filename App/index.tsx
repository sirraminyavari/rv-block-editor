import 'draft-js/dist/Draft.css'
import { useState } from 'react'
import { EditorState } from 'draft-js'
import useUiContext from './UiContext'

import BlockEditor from 'BlockEditor'
import ConfigControls from './ConfigControls'

import createBasicInlineStylesPlugin from 'Plugins/BasicInlineStyles'
import createHeadingsPlugin from 'Plugins/Headings'
import createListsPlugin from 'Plugins/Lists'
import createQuotePlugin from 'Plugins/Quote'
import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin'
import createCodeBlockPlugin from 'Plugins/CodeBlock'


const plugins = [
    createBasicInlineStylesPlugin (),
    createHeadingsPlugin (),
    createListsPlugin (),
    createQuotePlugin (),
    createBlockBreakoutPlugin ({ // TODO: Make this internal
        breakoutBlocks: [ 'header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six', 'blockquote' ],
        doubleBreakoutBlocks: [ 'unordered-list-item', 'ordered-list-item', 'code-block' ]
    }),
    createCodeBlockPlugin ()
]


export default function App () {
    const [ editorState, setEditorState ] = useState ( () => EditorState.createEmpty () )
    const { showState, language, direction } = useUiContext ()
    return <>
        <ConfigControls />
        <BlockEditor
            editorState = { editorState } setEditorState = { setEditorState }
            lang = { language } dir = { direction }
            plugins = { plugins }
        />
        { showState && <pre children = { JSON.stringify ( editorState, null, 4 ) } /> }
    </>
}
