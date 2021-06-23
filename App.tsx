import 'draft-js/dist/Draft.css'
import { useState, useEffect } from 'react'
import { EditorState } from 'draft-js'

import BlockEditor from 'BlockEditor'


export default function App () {
    const [ editorState, setEditorState ] = useState ( () => EditorState.createEmpty () )
    const [ showState, setShowState ] = useState ( localStorage.getItem ( 'showState' ) === 'true' )
    const [ lang, setLang ] = useState ( localStorage.getItem ( 'lang' ) || 'en' )
    const [ dir, setDir ] = useState ( localStorage.getItem ( 'dir' ) || 'ltr' )
    useEffect ( () => {
        localStorage.setItem ( 'showState', showState.toString () )
        localStorage.setItem ( 'lang', lang )
        localStorage.setItem ( 'dir', dir )
    }, [ showState, lang, dir ] )
    return <>
        <div style = {{ marginBottom: '1rem', display: 'grid', gridAutoFlow: 'column', gap: '1rem', justifyContent: 'start' }}>
            <label>
                <input type = 'checkbox' checked = { showState } onChange = { e => setShowState ( e.target.checked ) } />
                Show State
            </label>
            <label>
                Language: { ' ' }
                <select value = { lang } onChange = { e => setLang ( e.target.value ) }>
                    <option value = 'en' children = 'English' />
                    <option value = 'fa' children = 'Persian' />
                </select>
            </label>
            <label>
                Direction: { ' ' }
                <select value = { dir } onChange = { e => setDir ( e.target.value ) }>
                    <option value = 'ltr' children = 'Left to Right' />
                    <option value = 'rtl' children = 'Right to Left' />
                </select>
            </label>
        </div>
        <BlockEditor
            editorState = { editorState } setEditorState = { setEditorState }
            lang = { lang } dir = { dir }
        />
        { showState && <pre children = { JSON.stringify ( editorState, null, 4 ) } /> }
    </>
}
