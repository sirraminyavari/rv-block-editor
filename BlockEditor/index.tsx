import { forwardRef } from 'react'
import { language, direction } from 'BlockEditor'

import { EditorContextProvider } from './Contexts/EditorContext'
import { UiContextProvider } from './Contexts/UiContext'
import PluginsEditor from '@draft-js-plugins/editor'
import Editor, { BlockEditorProps as _BlockEditorProps } from './Editor'

export * from './types'
export { withBlockWrapper } from './BlockWrapper'


export interface BlockEditorProps extends _BlockEditorProps {
    styles?: { [ key: string ]: string }
    dir: direction
    lang: language
}

const BlockEditor = forwardRef < PluginsEditor, BlockEditorProps > ( ( {
    editorState, onChange: setEditorState, dir, lang, plugins, styles = {}, ...props }, ref
) => {
    return <EditorContextProvider
        editorState = { editorState }
        setEditorState = { setEditorState }
        plugins = { plugins }
    >
        <UiContextProvider styles = { styles } dir = { dir } lang = { lang }>
            <Editor
                ref = { ref }
                plugins = { plugins }
                { ...props }
            />
        </UiContextProvider>
    </EditorContextProvider>
} )
export default BlockEditor
