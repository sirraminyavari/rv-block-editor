import { EditorBlock } from 'draft-js'
import cn from 'classnames'

import { supportedLanguages } from '.'


export default function getCodeBlockComponent ( config ) {
    return props => <CodeBlock config = { config } { ...props } />
}

function CodeBlock ({ config, ...props }) {
    const { language, setLanguage } = props.blockProps
    return <div>
        <Controls language = { language } setLanguage = { setLanguage } />
        <pre className = { cn ( 'public/DraftStyleDefault/pre', config.styles?.pre ) }>
            <code>
                <EditorBlock { ...props } />
            </code>
        </pre>
    </div>
}

function Controls ({ language, setLanguage }) {
    return <div
        onMouseDown = { e => {
            e.stopPropagation ()
            e.nativeEvent.stopImmediatePropagation ()
            e.nativeEvent.stopPropagation ()
        } }
        onClick = { e => {
            e.stopPropagation ()
            e.nativeEvent.stopImmediatePropagation ()
            e.nativeEvent.stopPropagation ()
        } }
        contentEditable = { false }
    >
        <select value = { language } onChange = { e => setLanguage ( e.target.value ) }>
            { supportedLanguages.map ( ({ name, value }) => <option
                key = { value }
                value = { value }
                children = { name }
            /> ) }
        </select>
    </div>
}
