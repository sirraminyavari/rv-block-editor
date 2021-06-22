import { FC } from 'react'

import { EditorContextProvider } from './EditorContext'
import { UiContextProvider } from './UiContext'
import Editor from './Editor'


const BlockEditor: FC < any > = ({ editorState, setEditorState, props }) => {
    return <EditorContextProvider editorState = { editorState } setEditorState = { setEditorState }>
        <UiContextProvider>
            <Editor { ...props } />
        </UiContextProvider>
    </EditorContextProvider>
}
export default BlockEditor
