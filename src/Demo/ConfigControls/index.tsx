import { convertToRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import useUiContext from '../UiContext'
import { contentPresets } from '../getInitialEditorState'

import * as styles from './styles.module.scss'
import React from 'react'

export default function ConfigControls({ editorState, setEditorState }) {
    const {
        debugMode,
        setDebugMode,
        readOnly,
        setReadOnly,
        textarea,
        setTextarea,
        language,
        setLanguage,
        direction,
        setDirection,
        contentPreset,
        setContentPreset,
    } = useUiContext()
    window.setRo = t => {
        setReadOnly(t)
    }
    return (
        <div className={styles.configControls} dir="ltr">
            <label>
                <input type="checkbox" checked={debugMode} onChange={e => setDebugMode(e.target.checked)} />
                Debug Mode
            </label>
            <label>
                <input type="checkbox" checked={readOnly} onChange={e => setReadOnly(e.target.checked)} />
                Read-Only
            </label>
            <label>
                <input type="checkbox" checked={textarea} onChange={e => setTextarea(e.target.checked)} />
                Textarea
            </label>
            <label>
                Language:{' '}
                <select value={language} onChange={e => setLanguage(e.target.value as any)}>
                    <option value="en" children="English" />
                    <option value="fa" children="Persian" />
                </select>
            </label>
            <label>
                Direction:{' '}
                <select value={direction} onChange={e => setDirection(e.target.value as any)}>
                    <option value="ltr" children="Left to Right" />
                    <option value="rtl" children="Right to Left" />
                </select>
            </label>
            <label>
                Content Preset:{' '}
                <select
                    value={contentPreset}
                    onChange={e => {
                        const presetName = e.target.value
                        setContentPreset(presetName)
                        setEditorState(contentPresets[presetName]())
                    }}>
                    {Object.keys(contentPresets).map(presetName => (
                        <option key={presetName} value={presetName} children={presetName} />
                    ))}
                </select>
            </label>
            <button onClick={() => console.log(JSON.stringify(convertToRaw(editorState.getCurrentContent())))}>
                Log Raw Content
            </button>
            <button onClick={() => console.log(stateToHTML(editorState.getCurrentContent()))}>Log HTML Content</button>
        </div>
    )
}
