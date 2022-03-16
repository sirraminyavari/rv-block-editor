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
    updateRtblSelectionState: () => void,
    disable: boolean
): [ BlockLevelSelectionInfo, SetState < BlockLevelSelectionInfo >, () => void ] {
    const [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ] = useState < BlockLevelSelectionInfo > ( defaultBlockLevelSelectionInfo )

    const disableBls = useCallback ( () => {
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
        if ( disable || ! hasFocus || blockLevelSelectionInfo.enabled ) return
        const { anchorKey, focusKey } = rtblSelectionState
        if ( ! anchorKey || ! focusKey ) return
        if ( anchorKey !== focusKey )
            setBlockLevelSelectionInfo ( prevState => ({ ...prevState, enabled: true }) )
    }, [ disable, hasFocus, blockLevelSelectionInfo.enabled, rtblSelectionState ] )

    // Selection Handler
    useEffect ( () => {
        if ( disable || ! hasFocus || ! blockLevelSelectionInfo.enabled ) return

        const blockMap = contentState.getBlockMap ()
        const { startKey, endKey } = rtblSelectionState
        if ( ! startKey || ! endKey ) return // Just a check to increase safty and prevent bugs
        const selectionDepth = getSelectionDepth ( blockMap, startKey, endKey )
        const selectedBlocks = blsAwareGetBlockRange ( blockMap, startKey, endKey, selectionDepth )
        const selectedBlockKeys = selectedBlocks.keySeq ().toArray ()

        if (
            selectionDepth !== blockLevelSelectionInfo.selectionDepth ||
            selectedBlockKeys.join () !== blockLevelSelectionInfo.selectedBlockKeys.join ()
        ) setBlockLevelSelectionInfo ( prevState => ({ ...prevState, selectionDepth, selectedBlockKeys }) )
    }, [ disable, hasFocus, blockLevelSelectionInfo.enabled, rtblSelectionState ] )

    // Disable Trigger
    useEffect ( () => {
        if ( disable || ! blockLevelSelectionInfo.enabled ) return
        function handler () {
            setImmediate ( disableBls )
        }
        document.addEventListener ( 'selectstart', handler )
        document.addEventListener ( 'click', handler )
        return () => {
            document.removeEventListener ( 'selectstart', handler )
            document.removeEventListener ( 'click', handler )
        }
    }, [ disable, hasFocus, blockLevelSelectionInfo.enabled, contentState ] )

    return [ blockLevelSelectionInfo, setBlockLevelSelectionInfo, disableBls ]
}
