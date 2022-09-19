// TODO: Use sass utils for: [ data-block-key ][ dir = rtl ] & {}

import * as _defaultTheme from './defaultEditorTheme.module.scss'

import { forwardRef } from 'react'
import PluginsEditor from '@draft-js-plugins/editor'

import { Language, Direction, Dict, EditorPlugin } from '.'
import { EditorContextProvider } from './Contexts/EditorContext'
import { UiContextProvider } from './Contexts/UiContext'
import { TransformedPluginsContextProvider } from './Contexts/TransformedPlugins'
import Editor, { BlockEditorProps as _BlockEditorProps } from './Editor'

import './global.scss'

export * from './types'
import * as _plugins from 'Plugins'
export const plugins = _plugins
export const defaultTheme = _defaultTheme
export { withBlockWrapper } from './BlockWrapper'
export * from './Utils/convertLegacyHtmlToEditorState'

export interface BlockEditorProps extends Omit<_BlockEditorProps, 'plugins'> {
    styles?: { [key: string]: string }
    dict: Dict
    dir: Direction
    lang: Language
    plugins: EditorPlugin[]
    uiPortalNode: HTMLElement
    debugMode?: boolean
    textarea?: boolean
    readOnly?: boolean
}

/**
 * Provides the editor with all the required global contexts.
 */
const BlockEditor = forwardRef<PluginsEditor, BlockEditorProps>(
    (
        {
            editorState,
            onChange: setEditorState,
            styles = {},
            dict,
            dir,
            lang,
            plugins,
            uiPortalNode,
            debugMode = false,
            textarea = false,
            readOnly = false,
            ...props
        },
        ref
    ) => {
        return (
            <UiContextProvider
                editorState={editorState}
                styles={styles}
                dict={dict}
                dir={dir}
                lang={lang}
                uiPortalNode={uiPortalNode}
                debugMode={debugMode}
                textarea={textarea}
                readOnly={readOnly}>
                <TransformedPluginsContextProvider plugins={plugins}>
                    <EditorContextProvider editorState={editorState} setEditorState={setEditorState}>
                        <Editor key={'rerender' + +textarea} ref={ref} {...props} />
                    </EditorContextProvider>
                </TransformedPluginsContextProvider>
            </UiContextProvider>
        )
    }
)
export default BlockEditor
