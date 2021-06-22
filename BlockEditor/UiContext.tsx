import { createContext, useContext, useState, useRef, MutableRefObject } from 'react'
import { Editor } from 'draft-js'


export interface PlusMenuInfo { isOpen: boolean, anchor?: HTMLElement }

export interface DragInfo {
    dragging: boolean
    elem?: HTMLElement
}

export interface UiContext {
    plusMenu: PlusMenuInfo
    setPlusMenu: SetState < PlusMenuInfo >
    dragInfo: DragInfo,
    setDragInfo: SetState < DragInfo >,
    editorRef: MutableRefObject < Editor >
    blockRefs: MutableRefObject < { [ key: string ]: HTMLElement | null } >
}

export const UiContext = createContext < UiContext > ( null )
export const useUiContext = () => useContext ( UiContext )
export default useUiContext

export function UiContextProvider ({ children }) {
    const [ dragInfo, setDragInfo ] = useState ({ dragging: false, elem: null })
    const editorRef = useRef ()
    const blockRefs = useRef ({})
    const [ plusMenu, setPlusMenu ] = useState < PlusMenuInfo > ({ isOpen: false, anchor: null })
    return <UiContext.Provider
        value = {{
            dragInfo, setDragInfo,
            editorRef, blockRefs,
            plusMenu, setPlusMenu
        }}
        children = { children }
    />
}
