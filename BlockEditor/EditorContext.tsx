import { useState, useRef, createContext, useContext } from 'react'


export const EditorContext = createContext ( null )

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
