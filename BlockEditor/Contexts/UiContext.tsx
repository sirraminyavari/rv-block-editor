import { createContext, useContext, useState, useLayoutEffect, useRef, MutableRefObject, useCallback } from 'react'
import { ContentBlock } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import useEditorContext from './EditorContext'
import { Language, Direction, Dict } from 'BlockEditor'


/**
 * Refs to wrappers of all Content Blocks.
 * * Caveat: The refs of deleted blocks will be nulled. Always use `.filter ( Boolean )` or something.
 */
type BlockRefs = MutableRefObject < { [ key: string ]: HTMLDivElement | null } >

/**
 * Information regarding the Block Controls UI.
 */
export interface BlockControlsInfo {
    /**
     * Indicates which block we need to display the Block Controls UI on.
     */
    hoveredBlockKey?: string
    /**
     * Reference to the block on which the Block Controls UI needs to render.
     */
    hoveredBlockElem?: HTMLDivElement
}

/**
 * Information regarding the Plus Menu UI.
 */
export interface PlusActionMenuInfo {
    /**
     * Determines wich block has its Plus Menu currently openned.
     */
    openedBlock?: ContentBlock
}

/**
 * Information regarding the D&D functionality at the block level.
 */
export interface DragInfo {
    /**
     * Whether a block is being dragged.
     */
    dragging: boolean
    /**
     * Whether the current drag has been started via one of the drag handles.
     */
    isDraggingByHandle: boolean
    /**
     * The block that is currently being dragged.
     */
    block?: ContentBlock
    /**
     * Ref to the wrapper of the block that is currently being dragged.
     */
    elem?: HTMLElement
}

/**
 * Information regarding the Inline Style Menu UI.
 */
export interface InlineStyleMenuInfo {
    /**
     * Whether the Inline Style Menu is open.
     */
    isOpen: boolean
    /**
     * The native selection object on witch the Inline Style Menu operate.
     */
    domSelection?: Selection
    /**
     * @returns The Bounding Rect of @param domSelection .
     */
    getSelectionRect?: () => DOMRect | null
}

export interface UiContext {
    // Dictionary, Layout & Styles:
    dict: Dict, dir: Direction, lang: Language
    externalStyles: { [ key: string ]: string }
    // Refs:
    editorRef: MutableRefObject < Editor >
    wrapperRef: MutableRefObject < HTMLDivElement >
    innerWrapperRef: MutableRefObject < HTMLDivElement >
    blockRefs: BlockRefs
    // Block Functionality:
    blockControlsInfo: BlockControlsInfo
    setBlockControlsInfo: SetState < BlockControlsInfo >
    plusActionMenuInfo: PlusActionMenuInfo
    setPlusActionMenuInfo: SetState < PlusActionMenuInfo >
    dragInfo: DragInfo
    setDragInfo: SetState < DragInfo >
    // Inline Functionality:
    inlineStyleMenuInfo: InlineStyleMenuInfo
}

export const UiContext = createContext < UiContext > ( null )
export const useUiContext = () => useContext ( UiContext )
export default useUiContext

/**
 * Provides general information and calculated values regarding the Block Editor user interface.
 */
export function UiContextProvider ({ styles, dict, dir, lang, children }) {
    const { editorState } = useEditorContext ()
    const selectionState = editorState.getSelection ()

    const editorRef = useRef ()
    const wrapperRef = useRef < HTMLDivElement > ()
    const innerWrapperRef = useRef < HTMLDivElement > ()
    const blockRefs: BlockRefs = useRef ({})

    const [ blockControlsInfo, setBlockControlsInfo ] = useState < BlockControlsInfo > ()
    useLayoutEffect ( () => { // Set Block Controls on the first block initialy
        const firstBlockElem = wrapperRef.current.querySelector ( '[data-block-key]' ) as HTMLDivElement
        setBlockControlsInfo ( prev => ({ ...prev,
            hoveredBlockElem: firstBlockElem,
            hoveredBlockKey: firstBlockElem.getAttribute ( 'data-block-key' )
        }) )
    }, [] )
    const mouseY = useRef ( 0 )
    const positionBlockControls = useCallback ( ({ clientY: y }) => {
        mouseY.current = y
        const hoveredBlockElem: HTMLDivElement | null = ( () => {
            const blocks = Object.values ( blockRefs.current ).filter ( Boolean )
            for ( const block of blocks ) {
                const rect = block.getBoundingClientRect ()
                if ( rect.y <= y && rect.bottom >= y )
                    return block
            }
            return null
        } ) ()
        if ( ! hoveredBlockElem ) return setBlockControlsInfo ( prev => ({
            ...prev,
            hoveredBlockElem: blockRefs.current [ prev.hoveredBlockKey ]
        }) )
        const hoveredBlockKey = hoveredBlockElem.getAttribute ( 'data-block-key' )
        setBlockControlsInfo (
            prev => prev.hoveredBlockElem === hoveredBlockElem && prev.hoveredBlockKey === hoveredBlockKey
                ? prev : { ...prev, hoveredBlockElem, hoveredBlockKey }
        )
    }, [] )
    useLayoutEffect ( () => {
        document.addEventListener ( 'mousemove', positionBlockControls )
        const observer = new MutationObserver ( () => setBlockControlsInfo ( prev => ({ ...prev }) ) )
        observer.observe ( wrapperRef.current, { attributes: true, childList: true, subtree: true } )
        return () => {
            document.removeEventListener ( 'mousemove', positionBlockControls )
            observer.disconnect ()
        }
    }, [] )
    useLayoutEffect ( () => {
        positionBlockControls ({ clientY: mouseY.current })
    }, [ editorState ] )

    const [ plusActionMenuInfo, setPlusActionMenuInfo ] = useState < PlusActionMenuInfo > ({})
    if ( plusActionMenuInfo.openedBlock && (
        ! selectionState.getHasFocus () ||
        plusActionMenuInfo.openedBlock.getKey () !== selectionState.getAnchorKey () ||
        plusActionMenuInfo.openedBlock.getKey () !== selectionState.getFocusKey  () ||
        selectionState.getAnchorOffset () !== selectionState.getFocusOffset ()
    ) ) setPlusActionMenuInfo ( prev => ({ ...prev, openedBlock: null }) )

    const [ dragInfo, setDragInfo ] = useState ({
        dragging: false,
        isDraggingByHandle: false,
        block: null, elem: null
    })

    const inlineStyleMenuInfo: InlineStyleMenuInfo = ( () => {
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
            dict, dir, lang, externalStyles: styles,
            editorRef, wrapperRef, innerWrapperRef, blockRefs,
            blockControlsInfo, setBlockControlsInfo,
            plusActionMenuInfo, setPlusActionMenuInfo,
            dragInfo, setDragInfo,
            inlineStyleMenuInfo
        }}
        children = { children }
    />
}
