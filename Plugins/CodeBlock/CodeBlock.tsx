import { EditorBlock } from 'draft-js'
import cn from 'classnames'


export default function getCodeBlockComponent ( config ) {
    return props => <CodeBlock config = { config } { ...props } />
}

function CodeBlock ({ config, ...props }) {
    const { prism, language, setLanguage } = props.blockProps
    return <div>
        <Controls prism = { prism } language = { language } setLanguage = { setLanguage } />
        <pre className = { cn ( 'public/DraftStyleDefault/pre', config.styles?.pre ) }>
            <code>
                <EditorBlock { ...props } />
            </code>
        </pre>
    </div>
}

function Controls ({ language, setLanguage, prism }) {
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
            { Object.keys ( prism.languages ).map ( lang => <option
                key = { lang }
                value = { lang }
                children = { lang }
            /> ) }
        </select>
    </div>
}
