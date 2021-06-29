import { FC } from 'react'

import { EditorContextProvider } from './Contexts/EditorContext'
import { UiContextProvider } from './Contexts/UiContext'
import Editor from './Editor'


const BlockEditor: FC < any > = ({ editorState, setEditorState, ...props }) => {
    return <EditorContextProvider editorState = { editorState } setEditorState = { setEditorState }>
        <UiContextProvider>
            <Editor { ...props } />
        </UiContextProvider>
    </EditorContextProvider>
}
export default BlockEditor
