import { EditorState } from 'draft-js'

import { BlockLevelSelectionInfo } from '../Contexts/UiContext'

import trimCollapsedBlocks from './trimCollapsedBlocks'

export function goDown(editorState: EditorState, blsInfo: BlockLevelSelectionInfo): EditorState {
    const selectionState = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const blockMap = trimCollapsedBlocks(contentState.getBlockMap())
    const { selectionDepth, selectedBlockKeys } = blsInfo

    const newFocusBlock = (() => {
        if (selectionState.getIsBackward()) {
            const trimmedSelectedBlockKeys = selectedBlockKeys.slice(
                0,
                selectedBlockKeys.indexOf(selectionState.getAnchorKey()) + 1
            )
            const outerSelectedBlocks = trimmedSelectedBlockKeys
                .map(k => blockMap.get(k))
                .filter(b => b?.getDepth() === selectionDepth)
            return outerSelectedBlocks[1] || contentState.getBlockAfter(outerSelectedBlocks[0].getKey())
        } else {
            const lastSelectedBlockKey = selectedBlockKeys[selectedBlockKeys.length - 1]
            return contentState.getBlockAfter(lastSelectedBlockKey)
        }
    })()
    if (!newFocusBlock) return editorState

    const newSelectionState = selectionState.merge({
        focusKey: newFocusBlock.getKey(),
        focusOffset: 0,
    })
    return EditorState.forceSelection(editorState, newSelectionState)
}

export function goUp(editorState: EditorState, blsInfo: BlockLevelSelectionInfo): EditorState {
    const selectionState = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const blockMap = trimCollapsedBlocks(contentState.getBlockMap())
    const { selectionDepth, selectedBlockKeys } = blsInfo

    const newFocusBlock = (() => {
        if (selectionState.getIsBackward()) {
            const firstSelectedBlockKey = selectedBlockKeys[0]
            return contentState.getBlockBefore(firstSelectedBlockKey)
        } else {
            const trimmedSelectedBlockKeys = selectedBlockKeys.slice(
                selectedBlockKeys.indexOf(selectionState.getAnchorKey())
            )
            const outerSelectedBlocks = trimmedSelectedBlockKeys
                .map(k => blockMap.get(k))
                .filter(b => b?.getDepth() === selectionDepth)
            const lastOuterSelectedBlockKey = outerSelectedBlocks[outerSelectedBlocks.length - 1].getKey()
            return blockMap
                .reverse()
                .skipUntil((_, key) => key === lastOuterSelectedBlockKey)
                .skip(1)
                .first()
        }
    })()
    if (!newFocusBlock) return editorState

    const newSelectionState = selectionState.merge({
        focusKey: newFocusBlock.getKey(),
        focusOffset: newFocusBlock.getLength(),
    })
    return EditorState.forceSelection(editorState, newSelectionState)
}

export function goDownSingleBlock(editorState: EditorState, blsInfo: BlockLevelSelectionInfo): EditorState {
    const blockMap = trimCollapsedBlocks(editorState.getCurrentContent().getBlockMap())
    const selectionState = editorState.getSelection()

    const selectedBlockKey = blsInfo.selectedBlockKeys[0]
    if (!selectedBlockKey) return editorState
    const nextBlock = blockMap
        .skipUntil((_, key) => key === selectedBlockKey)
        .skip(1)
        .first()
    if (!nextBlock) return editorState

    const newSelectionState = selectionState.merge({
        isBackward: false,
        focusKey: nextBlock.getKey(),
        focusOffset: 0,
    })
    return EditorState.forceSelection(editorState, newSelectionState)
}

export function goUpSingleBlock(editorState: EditorState, blsInfo: BlockLevelSelectionInfo): EditorState {
    const blockMap = trimCollapsedBlocks(editorState.getCurrentContent().getBlockMap())
    const selectionState = editorState.getSelection()

    const selectedBlockKey = blsInfo.selectedBlockKeys[0]
    if (!selectedBlockKey) return editorState
    const prevBlock = blockMap
        .reverse()
        .skipUntil((_, key) => key === selectedBlockKey)
        .skip(1)
        .first()
    if (!prevBlock) return editorState

    const newSelectionState = selectionState.merge({
        isBackward: true,
        focusKey: prevBlock.getKey(),
        focusOffset: 0,
    })
    return EditorState.forceSelection(editorState, newSelectionState)
}
