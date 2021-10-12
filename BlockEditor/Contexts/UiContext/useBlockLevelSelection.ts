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

// TODO: Expose a DISABLE Method
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

        if (
            selectionDepth !== blockLevelSelectionInfo.selectionDepth ||
            selectedBlockKeys.join () !== blockLevelSelectionInfo.selectedBlockKeys.join ()
        ) setBlockLevelSelectionInfo ( prevState => ({ ...prevState, selectionDepth, selectedBlockKeys }) )
    }, [ hasFocus, blockLevelSelectionInfo.enabled, rtblSelectionState ] )

    // Selection Adjustment
    useEffect ( () => {
        if ( ! hasFocus || ! blockLevelSelectionInfo.enabled || isMouseDown ) return

        const isBackward = selectionState.getIsBackward ()
        const { selectedBlockKeys } = blockLevelSelectionInfo
        if ( ! selectedBlockKeys.length ) return

        const newSelectionStartKey = selectedBlockKeys [ 0 ]
        const newSelectionEndKey = selectedBlockKeys [ selectedBlockKeys.length - 1 ]
        const endLength = contentState.getBlockForKey ( newSelectionEndKey ).getLength ()

        const newSelection = selectionState.merge ({
            focusKey: isBackward ? newSelectionStartKey : newSelectionEndKey,
            focusOffset: isBackward ? 0 : endLength
        })

        if ( selectionState.equals ( newSelection ) ) return
        const blsSelectionAdjustedEditorState = EditorState.forceSelection ( editorState, newSelection )
        setEditorState ( blsSelectionAdjustedEditorState )
    }, [ hasFocus, blockLevelSelectionInfo.enabled, blockLevelSelectionInfo, isMouseDown ] )

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
