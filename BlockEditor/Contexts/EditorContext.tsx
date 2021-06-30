import { createContext, useContext, FC, useMemo } from 'react'
import { EditorState } from 'draft-js'
import { EditorPlugin, InlineStyle, PlusAction } from 'BlockEditor'

import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin'


export interface EditorContext {
    editorState: EditorState
    setEditorState: SetState < EditorState >
    plugins: EditorPlugin []
    inlineStyles: InlineStyle []
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

    const blockBreakoutPlugin = useMemo ( () => createBlockBreakoutPlugin ({ // TODO: Make this internal
        breakoutBlocks: plusActions.filter ( pa => pa.returnBreakout ).map ( pa => pa.action ),
        doubleBreakoutBlocks: plusActions.filter ( pa => pa.doubleBreakout ).map ( pa => pa.action )
    }), [] )

    return <EditorContext.Provider
        value = {{
            editorState, setEditorState,
            inlineStyles, plusActions,
            plugins: [ ...plugins, blockBreakoutPlugin ]
        }}
        children = { children }
    />
}
