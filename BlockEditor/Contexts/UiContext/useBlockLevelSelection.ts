import { useState, useEffect } from 'react'
import { ContentState, SelectionState } from 'draft-js'

import getBlockRange from 'BlockEditor/Lib/getBlockRange'
import getFirstAncestorByDepth from 'BlockEditor/Lib/getFirstAncestorByDepth'
import getLastCousinShallowerThan from 'BlockEditor/Lib/getLastCousinShallowerThan'
import { RtblSelectionState } from './useRtblSelectionState'


export interface BlockLevelSelectionInfo {
    enabled: boolean
    selectedBlockKeys: string []
}

const defaultBlockLevelSelectionInfo = {
    enabled: false, selectedBlockKeys: []
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

        const rawSelectedBlocks = getBlockRange ( blockMap, startKey, endKey )
        const selectionDepth = rawSelectedBlocks.toArray ().map ( b => b.getDepth () ).sort () [ 0 ]

        const adjustedStartKey = getFirstAncestorByDepth ( blockMap, startKey, selectionDepth ).getKey ()
        const adjustedEndKey = getLastCousinShallowerThan ( blockMap, endKey, selectionDepth ).getKey ()

        const selectedBlocks = getBlockRange ( blockMap, adjustedStartKey, adjustedEndKey )
        const selectedBlockKeys = selectedBlocks.keySeq ().toArray ()

        setBlockLevelSelectionInfo ( prevState => ({ ...prevState, selectedBlockKeys }) )
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
