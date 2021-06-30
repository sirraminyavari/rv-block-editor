import { createContext, useContext, FC } from 'react'
import { EditorState } from 'draft-js'
import { EditorPlugin, InlineStyle } from 'BlockEditor'


export interface EditorContext {
    editorState: EditorState
    setEditorState: SetState < EditorState >
    plugins: EditorPlugin []
    inlineStyles: InlineStyle []
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
    plugins: EditorPlugin []
}

export const EditorContextProvider: FC < EditorContextProviderProps > = ({ editorState, setEditorState, plugins, children }) => {
    const inlineStyles: InlineStyle [] = plugins.reduce ( ( acc, plugin ) => [
        ...acc, ...( plugin.inlineStyles || [] )
    ], [] )
    return <EditorContext.Provider
        value = {{ editorState, setEditorState, plugins, inlineStyles }}
        children = { children }
    />
}
