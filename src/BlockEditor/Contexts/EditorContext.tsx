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
        (incomingEditorState, prevEditorState) => {
            const subTransformers = allPlugins.map(p => p.stateTransformer).filter(Boolean)
            const memo = []
            function stateTransformer(
                incomingEditorState: EditorState,
                prevEditorState: EditorState,
                n = subTransformers.length - 1
            ) {
                if (memo[n]) return memo[n]
                if (n === 0) return subTransformers[0](incomingEditorState, prevEditorState)
                if (n === 1)
                    return subTransformers[1](
                        incomingEditorState,
                        stateTransformer(incomingEditorState, prevEditorState, 0)
                    )
                const nextEditorState = subTransformers[n](
                    stateTransformer(incomingEditorState, prevEditorState, n - 1),
                    stateTransformer(incomingEditorState, prevEditorState, n - 2)
                )
                memo[n] = nextEditorState
                return nextEditorState
            }
            return stateTransformer(incomingEditorState, prevEditorState)
        },
        [allPlugins]
    )

    return (
        <EditorContext.Provider
            value={{
                editorState,
                setEditorState(newEditorState: EditorState) {
                    setEditorState(stateTransformer(newEditorState, editorState))
                },
            }}
            children={children}
        />
    )
}
