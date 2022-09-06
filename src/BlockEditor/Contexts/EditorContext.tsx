import type { FC } from 'react'
import type { EditorState } from 'draft-js'
import { createContext, useContext } from 'react'

import { adjustSelection } from 'Plugins/Table/lib/adjustSelection'

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
    return (
        <EditorContext.Provider
            value={{
                editorState,
                setEditorState(newEditorState: EditorState) {
                    // TODO: Implement hooks // FIXME: Spaghetti code
                    setEditorState(adjustSelection(newEditorState))
                },
            }}
            children={children}
        />
    )
}
