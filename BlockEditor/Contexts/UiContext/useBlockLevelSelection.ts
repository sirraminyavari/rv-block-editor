import { useState, useEffect } from 'react'
import { EditorState } from 'draft-js'

import getSelectionDepth from 'BlockEditor/Lib/getSelectionDepth'
import blsAwareGetBlockRange from 'BlockEditor/Lib/blsAwareGetBlockRange'
import { MouseState } from './useMouseState'
import { RtblSelectionState } from './useRtblSelectionState'


export interface BlockLevelSelectionInfo {
    enabled: boolean
    selectedBlockKeys: string []
    selectionDepth: number
}

export const defaultBlockLevelSelectionInfo: BlockLevelSelectionInfo = {
    enabled: false, selectedBlockKeys: [], selectionDepth: null
}

export default function useBlockLevelSelection (
    editorState: EditorState,
    setEditorState: SetState < EditorState >,
    mouseState: MouseState,
    rtblSelectionState: RtblSelectionState,
    updateRtblSelectionState: () => void
): [ BlockLevelSelectionInfo, SetState < BlockLevelSelectionInfo > ] {
    const [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ] = useState < BlockLevelSelectionInfo > ( defaultBlockLevelSelectionInfo )

    const contentState = editorState.getCurrentContent ()
    const selectionState = editorState.getSelection ()
    const hasFocus = selectionState.getHasFocus ()
    const { isDown: isMouseDown } = mouseState

    // Enable Trigger
    useEffect ( () => {
        if ( ! hasFocus || blockLevelSelectionInfo.enabled ) return
        const { anchorKey, focusKey } = rtblSelectionState
        if ( ! anchorKey || ! focusKey ) return
        if ( anchorKey !== focusKey )
            setBlockLevelSelectionInfo ( prevState => ({ ...prevState, enabled: true }) )
    }, [ hasFocus, blockLevelSelectionInfo.enabled, rtblSelectionState ] )

    // Selection Handler
    useEffect ( () => {
        if ( ! hasFocus || ! blockLevelSelectionInfo.enabled ) return

        const blockMap = contentState.getBlockMap ()
        const { startKey, endKey } = rtblSelectionState
        const selectionDepth = getSelectionDepth ( blockMap, startKey, endKey )
        const selectedBlocks = blsAwareGetBlockRange ( blockMap, startKey, endKey, selectionDepth )
        const selectedBlockKeys = selectedBlocks.keySeq ().toArray ()
        setBlockLevelSelectionInfo ( prevState => ({ ...prevState, selectionDepth, selectedBlockKeys }) )

        if ( isMouseDown ) return
        const isBackward = selectionState.getIsBackward ()
        const startBlock = selectedBlocks.first ()
        const endBlock = selectedBlocks.last ()
        const newSelectionStartKey = startBlock.getKey ()
        const newSelectionEndKey = endBlock.getKey ()
        const endLength = endBlock.getLength ()
        const newSelection = selectionState.merge ({
            focusKey: isBackward ? newSelectionStartKey : newSelectionEndKey,
            focusOffset: isBackward ? 0 : endLength
        })
        if ( selectionState.equals ( newSelection ) ) return
        const blsSelectionAdjustedEditorState = EditorState.forceSelection ( editorState, newSelection )
        setEditorState ( blsSelectionAdjustedEditorState )
    }, [ hasFocus, isMouseDown, blockLevelSelectionInfo.enabled, rtblSelectionState, isMouseDown ] )

    // Disable Trigger
    useEffect ( () => {
        if ( ! blockLevelSelectionInfo.enabled ) return
        function handler () {
            setImmediate ( () => {
                updateRtblSelectionState ()
                setBlockLevelSelectionInfo ( defaultBlockLevelSelectionInfo )
            } )
        }
        document.addEventListener ( 'selectstart', handler )
        return () => document.removeEventListener ( 'selectstart', handler )
    }, [ hasFocus, blockLevelSelectionInfo.enabled, contentState ] )

    return [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ]
}
