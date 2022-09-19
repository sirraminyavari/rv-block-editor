import { FC, useCallback } from 'react'
import type { EditorState } from 'draft-js'
import { createContext, useContext } from 'react'

import useTransformedPluginsContext from './TransformedPlugins'

export interface EditorContext {
    editorState?: EditorState
    setEditorState?: SetState<EditorState>
}

export const EditorContext = createContext<EditorContext>({})
export const useEditorContext = () => useContext(EditorContext)
export default useEditorContext

export interface EditorContextProviderProps {
    editorState?: EditorState
    setEditorState?: SetState<EditorState>
}

/**
 * Provides access to the general state of the editor for the nested components.
 */
export const EditorContextProvider: FC<EditorContextProviderProps> = ({ editorState, setEditorState, children }) => {
    const { allPlugins } = useTransformedPluginsContext()
    const stateTransformer = useCallback(
        editorState => {
            const subTransformers = allPlugins.map(p => p.stateTransformer).filter(Boolean)
            const stateTransformer = subTransformers.reduce(
                (cb, transformer) => s => transformer(cb(s)),
                s => s
            )
            return stateTransformer(editorState)
        },
        [allPlugins]
    )

    return (
        <EditorContext.Provider
            value={{
                editorState,
                setEditorState(newEditorState: EditorState) {
                    setEditorState(stateTransformer(newEditorState))
                },
            }}
            children={children}
        />
    )
}
