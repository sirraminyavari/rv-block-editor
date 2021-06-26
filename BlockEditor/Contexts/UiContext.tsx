import { createContext, useContext, useState, useRef, MutableRefObject } from 'react'
import { ContentBlock, Editor } from 'draft-js'
import useEditorContext from './EditorContext'


export interface PlusMenuInfo { openedBlock?: ContentBlock }

export interface DragInfo {
    dragging: boolean
    isDraggingByHandle: boolean
    block?: ContentBlock
    elem?: HTMLElement
}

export interface InlineStyleMenuInfo {
    isOpen: boolean
    domSelection?: Selection
    getSelectionRect?: () => DOMRect | null
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
    const { editorState } = useEditorContext ()
    const selectionState = editorState.getSelection ()
    const editorRef = useRef ()
    const wrapperRef = useRef ()
    const blockRefs = useRef ({})

    const [ dragInfo, setDragInfo ] = useState ({
        dragging: false,
        isDraggingByHandle: false,
        block: null, elem: null
    })

    const [ plusMenuInfo, setPlusMenuInfo ] = useState < PlusMenuInfo > ({ openedBlock: null })
    if ( plusMenuInfo.openedBlock && (
        ! selectionState.getHasFocus () ||
        plusMenuInfo.openedBlock.getKey () !== selectionState.getAnchorKey () ||
        plusMenuInfo.openedBlock.getKey () !== selectionState.getFocusKey  () ||
        selectionState.getAnchorOffset () !== selectionState.getFocusOffset ()
    ) ) setPlusMenuInfo ( prev => ({ ...prev, openedBlock: null }) )

    const inlineStyleMenuInfo = ( () => {
        try {
            const isOpen = selectionState.getHasFocus () && (
                selectionState.getAnchorKey () !== selectionState.getFocusKey () ||
                selectionState.getAnchorOffset () !== selectionState.getFocusOffset ()
            )
            const domSelection = isOpen ? window.getSelection () : null
            const getSelectionRect = () => domSelection?.getRangeAt ( 0 ).getBoundingClientRect ()
            return { isOpen, domSelection, getSelectionRect }
        } catch {
            return { isOpen: false, getSelectionRect: () => null }
        }
    } ) ()

    return <UiContext.Provider
        value = {{
            editorRef, wrapperRef, blockRefs,
            dragInfo, setDragInfo,
            plusMenuInfo, setPlusMenuInfo,
            inlineStyleMenuInfo
        }}
        children = { children }
    />
}
