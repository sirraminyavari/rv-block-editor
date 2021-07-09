import { createContext, useContext, FC } from 'react'
import { EditorState } from 'draft-js'


export interface EditorContext {
    editorState: EditorState
    setEditorState: SetState < EditorState >
}

/**
 * Provides access to the general state of the editor in nested components.
 */
export const EditorContext = createContext < EditorContext > ( null )
export const useEditorContext = () => useContext ( EditorContext )
export default useEditorContext

export interface EditorContextProviderProps {
    editorState: EditorState
    setEditorState: SetState < EditorState >
}

export const EditorContextProvider: FC < EditorContextProviderProps > = ({ editorState, setEditorState, children }) => {
    return <EditorContext.Provider
        value = {{
            editorState, setEditorState
        }}
        children = { children }
    />
}
