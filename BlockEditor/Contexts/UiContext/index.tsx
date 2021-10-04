import { createContext, useContext, MutableRefObject } from 'react'
import Editor from '@draft-js-plugins/editor'

import { Language, Direction, Dict } from 'BlockEditor'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'

import useMouseState, { MouseState } from './useMouseState'
import useGlobalRefs, { BlockRefs } from './useGlobalRefs'
import useBlockControls, { BlockControlsInfo } from './useBlockControls'
import usePlusActionMenu, { PlusActionMenuInfo } from './usePlusActionMenu'
import useDrag, { DragInfo } from 'BlockEditor/DnD/useDrag'
import useRtblSelectionState, { RtblSelectionState } from './useRtblSelectionState'
import useBlockLevelSelection, { BlockLevelSelectionInfo } from './useBlockLevelSelection'
import useInlineStyleMenu, { InlineStyleMenuInfo } from './useInlineStyleMenu'

export * from './useBlockControls'
export * from './usePlusActionMenu'
export * from '../../DnD/useDrag'
export * from './useGlobalRefs'
export * from './useRtblSelectionState'
export * from './useBlockLevelSelection'
export * from './useInlineStyleMenu'


export interface UiContext {
    // Dictionary, Layout & Styles:
    dict: Dict, dir: Direction, lang: Language
    externalStyles: { [ key: string ]: string }
    // Global Refs:
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
    // Input State:
    mouseState: MouseState
    rtblSelectionState: RtblSelectionState
    updateRtblSelectionState: () => void
    // Block Level Selection:
    blockLevelSelectionInfo: BlockLevelSelectionInfo
    setBlockLevelSelectionInfo: SetState < BlockLevelSelectionInfo >
}

export const UiContext = createContext < UiContext > ( null )
export const useUiContext = () => useContext ( UiContext )
export default useUiContext

/**
 * Provides general information and calculated values regarding the Block Editor user interface.
 */
export function UiContextProvider ({ styles, dict, dir, lang, children }) {
    const { editorState, setEditorState } = useEditorContext ()
    const selectionState = editorState.getSelection ()
    const contentState = editorState.getCurrentContent ()

    const mouseState = useMouseState ()
    const { editorRef, wrapperRef, innerWrapperRef, blockRefs } = useGlobalRefs ()
    const [ blockControlsInfo, setBlockControlsInfo ] = useBlockControls ( editorState, wrapperRef, blockRefs )
    const [ plusActionMenuInfo, setPlusActionMenuInfo ] = usePlusActionMenu ( selectionState )
    const [ dragInfo, setDragInfo ] = useDrag ()
    const [ rtblSelectionState, updateRtblSelectionState ] = useRtblSelectionState ( contentState, selectionState )
    const [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ] = useBlockLevelSelection ( editorState, setEditorState, mouseState, rtblSelectionState, updateRtblSelectionState )
    const inlineStyleMenuInfo = useInlineStyleMenu ( blockLevelSelectionInfo.enabled, selectionState, rtblSelectionState )

    return <UiContext.Provider
        value = {{
            dict, dir, lang, externalStyles: styles,
            editorRef, wrapperRef, innerWrapperRef, blockRefs,
            blockControlsInfo, setBlockControlsInfo,
            plusActionMenuInfo, setPlusActionMenuInfo,
            dragInfo, setDragInfo,
            inlineStyleMenuInfo,
            mouseState, rtblSelectionState, updateRtblSelectionState,
            blockLevelSelectionInfo, setBlockLevelSelectionInfo
        }}
        children = { children }
    />
}
