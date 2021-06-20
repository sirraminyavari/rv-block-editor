import { useState, useRef, createContext, useContext, MutableRefObject } from 'react'
import { Editor, EditorState } from 'draft-js'


export interface DragInfo {
    dragging: boolean
    elem?: HTMLElement
}

export interface EditorContext {
    editorState: EditorState,
    setEditorState: React.Dispatch < React.SetStateAction < EditorState > >,
    dragInfo: DragInfo,
    setDragInfo: React.Dispatch < React.SetStateAction < DragInfo > >,
    editorRef: MutableRefObject < Editor >
    blockRefs: MutableRefObject < { [ key: string ]: HTMLElement | null } >
}

export const EditorContext = createContext < EditorContext > ( null )
export const useEditorContext = () => useContext ( EditorContext )
export default useEditorContext

export function EditorContextProvider ({ editorState, setEditorState, ...rest }) {

    const [ dragInfo, setDragInfo ] = useState ({ dragging: false, elem: null })

    const editorRef = useRef ()
    const blockRefs = useRef ({})

    return <EditorContext.Provider
        value = {{
            editorState, setEditorState,
            dragInfo, setDragInfo,
            editorRef, blockRefs
        }}
        { ...rest }
    />
}
