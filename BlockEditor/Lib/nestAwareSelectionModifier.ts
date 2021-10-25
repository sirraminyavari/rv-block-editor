import { BlockMap, EditorState } from 'draft-js'

import { BlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'

import getNextEqualOrShallowerBlock from './getNextEqualOrShallowerBlock'
import trimCollapsedBlocks from './trimCollapsedBlocks'


export function goDown ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const selectionState = editorState.getSelection ()
    const contentState = editorState.getCurrentContent ()
    const blockMap = trimCollapsedBlocks ( contentState.getBlockMap () )
    const { selectionDepth, selectedBlockKeys } = blsInfo

    const newFocusBlock = ( () => {
        if ( selectionState.getIsBackward () ) {
            const trimmedSelectedBlockKeys = selectedBlockKeys.slice ( 0, selectedBlockKeys.indexOf ( selectionState.getAnchorKey () ) + 1 )
            const outerSelectedBlocks = trimmedSelectedBlockKeys.map ( k => blockMap.get ( k ) ).filter ( b => b?.getDepth () === selectionDepth )
            return outerSelectedBlocks [ 1 ] || contentState.getBlockAfter ( outerSelectedBlocks [ 0 ].getKey () )
        } else {
            const lastSelectedBlockKey = selectedBlockKeys [ selectedBlockKeys.length - 1 ]
            const nextEqualOrShallowerBlock = getNextEqualOrShallowerBlock (
                blockMap,
                lastSelectedBlockKey,
                selectionDepth
            )
            if ( ! nextEqualOrShallowerBlock ) return blockMap.get ( lastSelectedBlockKey )
            return nextEqualOrShallowerBlock
        }
    } ) ()

    const newSelectionState = selectionState.merge ({
        focusKey: newFocusBlock.getKey (),
        focusOffset: 0
    })
    return EditorState.forceSelection ( editorState, newSelectionState )
}

export function goUp ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const selectionState = editorState.getSelection ()
    const contentState = editorState.getCurrentContent ()
    const blockMap = trimCollapsedBlocks ( contentState.getBlockMap () )
    const { selectionDepth, selectedBlockKeys } = blsInfo

    const newFocusBlock = ( () => {
        if ( selectionState.getIsBackward () ) {
            const firstSelectedBlockKey = selectedBlockKeys [ 0 ]
            const nextEqualOrShallowerBlock = getNextEqualOrShallowerBlock (
                blockMap.reverse () as BlockMap,
                firstSelectedBlockKey,
                selectionDepth
            )
            if ( ! nextEqualOrShallowerBlock ) return blockMap.get ( firstSelectedBlockKey )
            return nextEqualOrShallowerBlock
        } else {
            const trimmedSelectedBlockKeys = selectedBlockKeys.slice ( selectedBlockKeys.indexOf ( selectionState.getAnchorKey () ) )
            const outerSelectedBlocks = trimmedSelectedBlockKeys.map ( k => blockMap.get ( k ) ).filter ( b => b?.getDepth () === selectionDepth )
            const lastOuterSelectedBlockKey = outerSelectedBlocks [ outerSelectedBlocks.length - 1 ].getKey ()
            return blockMap.reverse ().skipUntil ( b => b.getKey () === lastOuterSelectedBlockKey ).skip ( 1 ).first ()
        }
    } ) ()
    if ( ! newFocusBlock ) return editorState

    const newSelectionState = selectionState.merge ({
        focusKey: newFocusBlock.getKey (),
        focusOffset: newFocusBlock.getLength ()
    })
    return EditorState.forceSelection ( editorState, newSelectionState )
}

export function goDownSingleBlock ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const blockMap = trimCollapsedBlocks ( editorState.getCurrentContent ().getBlockMap () )
    const selectionState = editorState.getSelection ()

    const selectedBlockKey = blsInfo.selectedBlockKeys [ 0 ]
    if ( ! selectedBlockKey ) return editorState
    const nextBlock = blockMap.skipUntil ( b => b.getKey () === selectedBlockKey ).skip ( 1 ).first ()
    if ( ! nextBlock ) return editorState

    const newSelectionState = selectionState.merge ({
        isBackward: false,
        focusKey: nextBlock.getKey (),
        focusOffset: 0
    })
    return EditorState.forceSelection ( editorState, newSelectionState )
}

export function goUpSingleBlock ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const blockMap = trimCollapsedBlocks ( editorState.getCurrentContent ().getBlockMap () )
    const selectionState = editorState.getSelection ()

    const selectedBlockKey = blsInfo.selectedBlockKeys [ 0 ]
    if ( ! selectedBlockKey ) return editorState
    const prevBlock = blockMap.reverse ().skipUntil ( b => b.getKey () === selectedBlockKey ).skip ( 1 ).first ()
    if ( ! prevBlock ) return editorState

    const newSelectionState = selectionState.merge ({
        isBackward: true,
        focusKey: prevBlock.getKey (),
        focusOffset: 0
    })
    return EditorState.forceSelection ( editorState, newSelectionState )
}
