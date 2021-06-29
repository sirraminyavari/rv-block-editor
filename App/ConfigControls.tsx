
import useUiContext from './UiContext'


export default function ConfigControls () {
    const { showState, setShowState, language, setLanguage, direction, setDirection } = useUiContext ()
    return <div className = 'demo-ui'>
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
    </div>
}
