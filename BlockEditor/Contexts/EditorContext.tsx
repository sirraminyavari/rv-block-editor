import { createContext, useContext, FC } from 'react'
import { EditorState } from 'draft-js'
import { EditorPlugin, InlineStyle, PlusAction } from 'BlockEditor'


export interface EditorContext {
    editorState: EditorState
    setEditorState: SetState < EditorState >
    /**
     * All the Inline Styles extracted from plugins
     */
    inlineStyles: InlineStyle []
    /**
     * All the Plus Actions extracted from plugins
     */
    plusActions: PlusAction []
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

    const plusActions: PlusAction [] = plugins.reduce ( ( acc, plugin ) => [
        ...acc, ...( plugin.plusActions || [] )
    ], [] )

    return <EditorContext.Provider
        value = {{
            editorState, setEditorState,
            inlineStyles, plusActions,
        }}
        children = { children }
    />
}
