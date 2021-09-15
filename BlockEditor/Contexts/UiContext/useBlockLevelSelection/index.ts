import { useState, useEffect } from 'react'
import { ContentState, SelectionState } from 'draft-js'

import calcRtblSelectionState from './calcRtblSelectionState'
import getBlockRange from 'BlockEditor/Lib/getBlockRange'
import getFirstAncestorByDepth from 'BlockEditor/Lib/getFirstAncestorByDepth'
import getLastCousinShallowerThan from 'BlockEditor/Lib/getLastCousinShallowerThan'


export interface BlockLevelSelectionInfo {
    enabled: boolean
    selectedBlockKeys: string []
}

// Real-Time Selection State
export interface RtblSelectionState {
    anchorKey: string
    focusKey: string
    startKey: string
    endKey: string
    // isBackward only takes blocks into account and is false for any in-block selection
    isBackward: boolean
}

const defaultRtblSelectionState: RtblSelectionState = {
    anchorKey: '', focusKey: '',
    startKey: '', endKey: '',
    isBackward: false,
}

const defaultBlockLevelSelectionInfo = {
    enabled: false, selectedBlockKeys: []
}

export default function useBlockLevelSelection (
    contentState: ContentState,
    selectionState: SelectionState,
): [ BlockLevelSelectionInfo, SetState < BlockLevelSelectionInfo > ] {
    const [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ] = useState < BlockLevelSelectionInfo > ( defaultBlockLevelSelectionInfo )
    const [ rtblSelectionState, setRtblSelectionState ] = useState ( defaultRtblSelectionState )

    const hasFocus = selectionState.getHasFocus ()

    // Track Selection
    useEffect ( () => {
        if ( ! hasFocus ) return
        function handler () {
            const domSelection = getSelection ()
            setRtblSelectionState ( calcRtblSelectionState ( contentState, domSelection ) )
        }
        document.addEventListener ( 'selectionchange', handler )
        return () => document.removeEventListener ( 'selectionchange', handler )
    }, [ hasFocus ] )

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
                const domSelection = getSelection ()
                setRtblSelectionState ( calcRtblSelectionState ( contentState, domSelection ) )
                setBlockLevelSelectionInfo ( defaultBlockLevelSelectionInfo )
            } )
        }
        document.addEventListener ( 'selectstart', handler )
        return () => document.removeEventListener ( 'selectstart', handler )
    }, [ hasFocus, blockLevelSelectionInfo.enabled, contentState ] )

    return [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ]
}
