import { FC } from 'react'

import { EditorContextProvider } from './Contexts/EditorContext'
import { UiContextProvider } from './Contexts/UiContext'
import Editor from './Editor'


export * from './types'


const BlockEditor: FC < any > = ({ editorState, setEditorState, plugins, ...props }) => {
    return <EditorContextProvider
        editorState = { editorState }
        setEditorState = { setEditorState }
        plugins = { plugins }
    >
        <UiContextProvider>
            <Editor { ...props } />
        </UiContextProvider>
    </EditorContextProvider>
}
export default BlockEditor
