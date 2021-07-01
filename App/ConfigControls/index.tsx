
import { convertToRaw } from 'draft-js'

import useUiContext from 'App/UiContext'
import { contentPresets } from 'App/getInitialEditorState'

import styles from './styles.module.scss'


export default function ConfigControls ({ editorState, setEditorState }) {
    const { showState, setShowState, language, setLanguage, direction, setDirection, contentPreset, setContentPreset } = useUiContext ()
    return <div className = { styles.configControls }>
        <label>
            <input type = 'checkbox' checked = { showState } onChange = { e => setShowState ( e.target.checked ) } />
            Show State
        </label>
        <label>
            Language: { ' ' }
            <select value = { language } onChange = { e => setLanguage ( e.target.value as any ) }>
                <option value = 'en' children = 'English' />
                <option value = 'fa' children = 'Persian' />
            </select>
        </label>
        <label>
            Direction: { ' ' }
            <select value = { direction } onChange = { e => setDirection ( e.target.value as any ) }>
                <option value = 'ltr' children = 'Left to Right' />
                <option value = 'rtl' children = 'Right to Left' />
            </select>
        </label>
        <label>
            Content Preset: { ' ' }
            <select value = { contentPreset } onChange = { e => {
                const presetName = e.target.value
                setContentPreset ( presetName )
                setEditorState ( contentPresets [ presetName ] () )
            } }>
                { Object.keys ( contentPresets ).map ( presetName => <option
                    key = { presetName }
                    value = { presetName }
                    children = { presetName }
                /> ) }
            </select>
        </label>
        <button onClick = { () => console.log ( JSON.stringify ( convertToRaw ( editorState.getCurrentContent () ) ) ) }>Log Raw Content</button>
    </div>
}
