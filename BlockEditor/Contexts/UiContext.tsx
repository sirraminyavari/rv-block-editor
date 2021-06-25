import { createContext, useContext, useState, useRef, MutableRefObject } from 'react'
import { ContentBlock, Editor } from 'draft-js'
import useEditorContext from './EditorContext'


export interface PlusMenuInfo {
    hoveredBlock?: ContentBlock
    openedBlock?: ContentBlock
}

export interface DragInfo {
    dragging: boolean
    isDraggingByHandle: boolean
    block?: ContentBlock
    elem?: HTMLElement
}

export interface InlineStyleMenuInfo {
    isOpen: boolean
    domSelection?: Selection
    selectionRect?: DOMRect
}

export interface UiContext {
    plusMenuInfo: PlusMenuInfo
    setPlusMenuInfo: SetState < PlusMenuInfo >
    dragInfo: DragInfo
    setDragInfo: SetState < DragInfo >
    editorRef: MutableRefObject < Editor >
    wrapperRef: MutableRefObject < HTMLDivElement >
    blockRefs: MutableRefObject < { [ key: string ]: HTMLElement | null } >
    inlineStyleMenuInfo: InlineStyleMenuInfo
}

export const UiContext = createContext < UiContext > ( null )
export const useUiContext = () => useContext ( UiContext )
export default useUiContext

export function UiContextProvider ({ children }) {
    const editorRef = useRef ()
    const wrapperRef = useRef ()
    const blockRefs = useRef ({})

    const [ dragInfo, setDragInfo ] = useState ({
        dragging: false,
        isDraggingByHandle: false,
        block: null, elem: null
    })

    const [ plusMenuInfo, setPlusMenuInfo ] = useState < PlusMenuInfo > ({
        hoveredBlock: null,
        openedBlock: null
    })

    const { editorState } = useEditorContext ()
    const selectionState = editorState.getSelection ()
    const inlineStyleMenuInfo: InlineStyleMenuInfo = ( () => {
        try {
            const isOpen = selectionState.getHasFocus () && (
                selectionState.getAnchorKey () !== selectionState.getFocusKey () ||
                selectionState.getAnchorOffset () !== selectionState.getFocusOffset ()
            )
            const domSelection = isOpen ? window.getSelection () : null
            const selectionRect = domSelection?.getRangeAt ( 0 ).getBoundingClientRect ()
            return { isOpen, domSelection, selectionRect }
        } catch {
            return { isOpen: false }
        }
    } ) ()

    return <UiContext.Provider
        value = {{
            dragInfo, setDragInfo,
            editorRef, wrapperRef, blockRefs,
            plusMenuInfo, setPlusMenuInfo,
            inlineStyleMenuInfo
        }}
        children = { children }
    />
}
