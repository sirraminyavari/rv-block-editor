import { useState } from 'react'
import { EditorState } from 'draft-js'

import BlockEditor from 'BlockEditor'


export default function App () {
    const [ editorState, setEditorState ] = useState ( () => EditorState.createEmpty () )
    return <>
        <BlockEditor editorState = { editorState } setEditorState = { setEditorState } />
        {/* <pre children = { JSON.stringify ( editorState, null, 4 ) } /> */}
    </>
}
