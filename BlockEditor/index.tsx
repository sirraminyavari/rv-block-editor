import { forwardRef } from 'react'
import { Language, Direction, Dict, EditorPlugin } from 'BlockEditor'

import { EditorContextProvider } from './Contexts/EditorContext'
import { UiContextProvider } from './Contexts/UiContext'
import { TransformedPluginsContextProvider } from './Contexts/TransformedPlugins'
import PluginsEditor from '@draft-js-plugins/editor'
import Editor, { BlockEditorProps as _BlockEditorProps } from './Editor'

export * from './types'
export { withBlockWrapper } from './BlockWrapper'


export interface BlockEditorProps extends _BlockEditorProps {
    styles?: { [ key: string ]: string }
    dict: Dict
    dir: Direction
    lang: Language
    plugins: EditorPlugin []
    maxDepth?: number
}

/**
 * Provides the editor with all the required global contexts.
 */
const BlockEditor = forwardRef < PluginsEditor, BlockEditorProps > ( ( {
    editorState, onChange: setEditorState, styles = {},
    dict, dir, lang, plugins, maxDepth = Infinity,
    ...props
}, ref ) => {
    return <EditorContextProvider editorState = { editorState } setEditorState = { setEditorState }>
        <UiContextProvider styles = { styles } dict = { dict } dir = { dir } lang = { lang }>
            <TransformedPluginsContextProvider plugins = { plugins } maxDepth = { maxDepth }>
                <Editor ref = { ref } { ...props } />
            </TransformedPluginsContextProvider>
        </UiContextProvider>
    </EditorContextProvider>
} )
export default BlockEditor
