import 'draft-js/dist/Draft.css'
import { useState } from 'react'
import { EditorState } from 'draft-js'
import useUiContext from './UiContext'

import BlockEditor from 'BlockEditor'
import ConfigControls from './ConfigControls'


export default function App () {
    const [ editorState, setEditorState ] = useState ( () => EditorState.createEmpty () )
    const { showState, language, direction } = useUiContext ()
    return <>
        <ConfigControls />
        <BlockEditor
            editorState = { editorState } setEditorState = { setEditorState }
            lang = { language } dir = { direction }
        />
        { showState && <pre children = { JSON.stringify ( editorState, null, 4 ) } /> }
    </>
}
