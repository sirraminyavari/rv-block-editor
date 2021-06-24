import { createContext, useContext } from 'react'
import { EditorState } from 'draft-js'


export interface EditorContext {
    editorState: EditorState,
    setEditorState: SetState < EditorState >,
}

export const EditorContext = createContext < EditorContext > ( null )
export const useEditorContext = () => useContext ( EditorContext )
export default useEditorContext

export function EditorContextProvider ({ editorState, setEditorState, ...rest }) {
    console.log ( ( editorState as EditorState ).getSelection ().serialize () )
    return <EditorContext.Provider
        value = {{ editorState, setEditorState }}
        { ...rest }
    />
}
