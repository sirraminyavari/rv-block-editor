import { forwardRef } from 'react'

import { EditorContextProvider } from './Contexts/EditorContext'
import { UiContextProvider } from './Contexts/UiContext'
import PluginsEditor from '@draft-js-plugins/editor'
import Editor from './Editor'


export * from './types'
export { withBlockWrapper } from './BlockWrapper'


const BlockEditor = forwardRef < PluginsEditor, any > ( ( { editorState, setEditorState, plugins, ...props }, ref ) => {
    return <EditorContextProvider
        editorState = { editorState }
        setEditorState = { setEditorState }
        plugins = { plugins }
    >
        <UiContextProvider>
            <Editor
                ref = { ref }
                plugins = { plugins }
                { ...props }
            />
        </UiContextProvider>
    </EditorContextProvider>
} )
export default BlockEditor
