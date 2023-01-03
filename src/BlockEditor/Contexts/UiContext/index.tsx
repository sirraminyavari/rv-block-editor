import { FC, createContext, useContext, MutableRefObject } from 'react'
import { EditorState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'

import { Language, Direction, Dict as Dictionary } from 'BlockEditor'

import useGlobalRefs, { BlockRefs } from './useGlobalRefs'
import useBlockControls, { BlockControlsInfo } from './useBlockControls'
import usePlusActionMenu, { PlusActionMenuInfo } from './usePlusActionMenu'
import useDrag, { DragInfo } from 'BlockEditor/DnD/useDrag'
import useRtblSelectionState, {
    RtblSelectionState,
} from './useRtblSelectionState'
import useBlockLevelSelection, {
    BlockLevelSelectionInfo,
} from './useBlockLevelSelection'
import useInlineStyleMenu, { InlineStyleMenuInfo } from './useInlineStyleMenu'
import useCollapsedBlocks, { CollapsedBlocks } from './useCollapsedBlocks'

export * from './useBlockControls'
export * from './usePlusActionMenu'
export * from './useGlobalRefs'
export * from './useRtblSelectionState'
export * from './useBlockLevelSelection'
export * from './useInlineStyleMenu'
export * from 'BlockEditor/DnD/useDrag'

export interface UiContext {
    // Misc:
    dict: Dictionary
    dir: Direction
    lang: Language
    externalStyles: Record<string, string>
    debugMode: boolean
    textarea: boolean
    readOnly: boolean
    collapsedBlocks: CollapsedBlocks
    // Global Refs:
    editorRef: MutableRefObject<Editor>
    wrapperRef: MutableRefObject<HTMLDivElement>
    innerWrapperRef: MutableRefObject<HTMLDivElement>
    blockRefs: BlockRefs
    uiPortalNode: HTMLElement
    // Block Functionality:
    blockControlsInfo: BlockControlsInfo
    setBlockControlsInfo: SetState<BlockControlsInfo>
    plusActionMenuInfo: PlusActionMenuInfo
    setPlusActionMenuInfo: SetState<PlusActionMenuInfo>
    dragInfo: DragInfo
    setDragInfo: SetState<DragInfo>
    // Inline Functionality:
    inlineStyleMenuInfo: InlineStyleMenuInfo
    // Input State:
    rtblSelectionState: RtblSelectionState
    updateRtblSelectionState: () => void
    // Block Level Selection:
    blockLevelSelectionInfo: BlockLevelSelectionInfo
    setBlockLevelSelectionInfo: SetState<BlockLevelSelectionInfo>
    disableBls: () => void
    suspendBls: MutableRefObject<boolean>
}

export const UiContext = createContext<UiContext>(null)
export const useUiContext = () => useContext(UiContext)
export default useUiContext

export interface UiContextProviderProps {
    editorState: EditorState
    styles: Record<string, string>
    dict: Dictionary
    dir: Direction
    lang: Language
    uiPortalNode: HTMLElement
    debugMode: boolean
    textarea: boolean
    readOnly: boolean
}

/**
 * Provides general information and calculated values regarding the Block Editor user interface.
 */
export const UiContextProvider: FC<UiContextProviderProps> = ({
    editorState,
    styles,
    dict,
    dir,
    lang,
    uiPortalNode,
    debugMode,
    textarea,
    readOnly,
    children,
}) => {
    const selectionState = editorState.getSelection()
    const contentState = editorState.getCurrentContent()

    const { editorRef, wrapperRef, innerWrapperRef, blockRefs } =
        useGlobalRefs()
    const [blockControlsInfo, setBlockControlsInfo] = useBlockControls(
        editorState,
        wrapperRef,
        blockRefs,
        textarea
    )
    const [plusActionMenuInfo, setPlusActionMenuInfo] = usePlusActionMenu(
        selectionState,
        textarea
    )
    const [dragInfo, setDragInfo] = useDrag()
    const [rtblSelectionState, updateRtblSelectionState] =
        useRtblSelectionState(contentState, selectionState, textarea)
    const [
        blockLevelSelectionInfo,
        setBlockLevelSelectionInfo,
        disableBls,
        suspendBls,
    ] = useBlockLevelSelection(
        editorState,
        rtblSelectionState,
        updateRtblSelectionState,
        textarea
    )
    const inlineStyleMenuInfo = useInlineStyleMenu(
        blockLevelSelectionInfo.enabled,
        selectionState,
        rtblSelectionState
    )
    const collapsedBlocks = useCollapsedBlocks(contentState)

    return (
        <UiContext.Provider
            value={{
                dict,
                dir,
                lang,
                externalStyles: styles,
                uiPortalNode,
                debugMode,
                textarea,
                readOnly,
                collapsedBlocks,
                editorRef,
                wrapperRef,
                innerWrapperRef,
                blockRefs,
                blockControlsInfo,
                setBlockControlsInfo,
                plusActionMenuInfo,
                setPlusActionMenuInfo,
                dragInfo,
                setDragInfo,
                inlineStyleMenuInfo,
                rtblSelectionState,
                updateRtblSelectionState,
                blockLevelSelectionInfo,
                setBlockLevelSelectionInfo,
                disableBls,
                suspendBls,
            }}
            children={children}
        />
    )
}
