import { forwardRef } from 'react'
import PluginsEditor from '@draft-js-plugins/editor'

import { Language, Direction, Dict, EditorPlugin } from 'BlockEditor'
import { EditorContextProvider } from 'BlockEditor/Contexts/EditorContext'
import { UiContextProvider } from 'BlockEditor/Contexts/UiContext'
import { TransformedPluginsContextProvider } from 'BlockEditor/Contexts/TransformedPlugins'
import Editor, { BlockEditorProps as _BlockEditorProps } from 'BlockEditor/Editor'

export * from './types'
export { withBlockWrapper } from './BlockWrapper'


export interface BlockEditorProps extends Omit < _BlockEditorProps, 'plugins' > {
    styles?: { [ key: string ]: string }
    dict: Dict
    dir: Direction
    lang: Language
    plugins: EditorPlugin []
    portalNode: HTMLElement
    debugMode?: boolean
}

/**
 * Provides the editor with all the required global contexts.
 */
const BlockEditor = forwardRef < PluginsEditor, BlockEditorProps > ( ( {
    editorState, onChange: setEditorState, styles = {},
    dict, dir, lang, plugins, portalNode, debugMode = false,
    ...props
}, ref ) => {
    return <EditorContextProvider editorState = { editorState } setEditorState = { setEditorState }>
        <UiContextProvider
            styles = { styles }
            dict = { dict } dir = { dir } lang = { lang }
            portalNode = { portalNode }
            debugMode = { debugMode }
        >
            <TransformedPluginsContextProvider plugins = { plugins }>
                <Editor ref = { ref } { ...props } />
            </TransformedPluginsContextProvider>
        </UiContextProvider>
    </EditorContextProvider>
} )
export default BlockEditor
