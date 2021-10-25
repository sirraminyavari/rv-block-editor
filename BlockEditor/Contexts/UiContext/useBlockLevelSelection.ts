import { useState, useEffect, useCallback } from 'react'
import { EditorState } from 'draft-js'

import getSelectionDepth from 'BlockEditor/Lib/getSelectionDepth'
import blsAwareGetBlockRange from 'BlockEditor/Lib/blsAwareGetBlockRange'
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
    rtblSelectionState: RtblSelectionState,
    updateRtblSelectionState: () => void
): [ BlockLevelSelectionInfo, SetState < BlockLevelSelectionInfo >, () => void ] {
    const [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ] = useState < BlockLevelSelectionInfo > ( defaultBlockLevelSelectionInfo )

    const disable = useCallback ( () => {
        if ( ! editorState.getSelection ().isCollapsed () )
            throw new Error ( "Selection must be collapsed before BLS could be disabled." )
        updateRtblSelectionState ()
        setBlockLevelSelectionInfo ( defaultBlockLevelSelectionInfo )
    }, [] )

    const contentState = editorState.getCurrentContent ()
    const selectionState = editorState.getSelection ()
    const hasFocus = selectionState.getHasFocus ()

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

    // Disable Trigger
    useEffect ( () => {
        if ( ! blockLevelSelectionInfo.enabled ) return
        function handler () {
            setImmediate ( disable )
        }
        document.addEventListener ( 'selectstart', handler )
        return () => document.removeEventListener ( 'selectstart', handler )
    }, [ hasFocus, blockLevelSelectionInfo.enabled, contentState ] )

    return [ blockLevelSelectionInfo, setBlockLevelSelectionInfo, disable ]
}
