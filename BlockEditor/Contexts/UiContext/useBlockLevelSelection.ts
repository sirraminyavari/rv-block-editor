import { useState, useEffect } from 'react'
import { ContentState, SelectionState } from 'draft-js'

import getSelectionDepth from 'BlockEditor/Lib/getSelectionDepth'
import blsAwareGetBlockRange from 'BlockEditor/Lib/blsAwareGetBlockRange'
import { RtblSelectionState } from './useRtblSelectionState'


export interface BlockLevelSelectionInfo {
    enabled: boolean
    selectedBlockKeys: string []
    selectionDepth: number
}

const defaultBlockLevelSelectionInfo: BlockLevelSelectionInfo = {
    enabled: false, selectedBlockKeys: [], selectionDepth: 0
}

export default function useBlockLevelSelection (
    contentState: ContentState,
    selectionState: SelectionState,
    rtblSelectionState: RtblSelectionState,
    updateRtblSelectionState: () => void
): [ BlockLevelSelectionInfo, SetState < BlockLevelSelectionInfo > ] {
    const [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ] = useState < BlockLevelSelectionInfo > ( defaultBlockLevelSelectionInfo )

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

        setBlockLevelSelectionInfo ( prevState => ({ ...prevState, selectionDepth, selectedBlockKeys }) )
    }, [ hasFocus, blockLevelSelectionInfo.enabled, rtblSelectionState ] )

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
