import { useState, useEffect } from 'react'
import { ContentState, SelectionState, BlockMap } from 'draft-js'

import { WrapperRef } from './useGlobalRefs'


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
    outerWrapperRef: WrapperRef
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
        const selectedBlocks: BlockMap = blockMap
            .toSeq ()
            .skipUntil ( ( _, key ) => key === startKey )
            .takeUntil ( ( _, key ) => key === endKey )
            .concat ([[ endKey, blockMap.get ( endKey ) ]])
            .toOrderedMap ()
        const selectedBlockKeys = selectedBlocks.keySeq ().toArray ()
        setBlockLevelSelectionInfo ( prevState => ({ ...prevState, selectedBlockKeys }) )
    }, [ hasFocus, blockLevelSelectionInfo.enabled, rtblSelectionState ] )

    // Disable Trigger
    useEffect ( () => {
        if ( ! blockLevelSelectionInfo.enabled ) return
        function handler () {
            setImmediate ( () => {
                const domSelection = getSelection ()
                const { isCollapsed } = domSelection
                if ( ! isCollapsed ) return
                // This line is necessary to prevent bugs
                setRtblSelectionState ( calcRtblSelectionState ( contentState, domSelection ) )
                setBlockLevelSelectionInfo ( defaultBlockLevelSelectionInfo )
            } )
        }
        outerWrapperRef.current.addEventListener ( 'mousedown', handler )
        return () => outerWrapperRef.current.removeEventListener ( 'click', handler )
    }, [ hasFocus, blockLevelSelectionInfo.enabled ] )

    return [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ]
}


function calcRtblSelectionState ( contentState: ContentState, domSelection: Selection ): RtblSelectionState {
    const anchorKey = getParentBlockKey ( domSelection.anchorNode )
    const focusKey = getParentBlockKey ( domSelection.focusNode )
    const isBackward = calcIsBackward ( contentState, anchorKey, focusKey )
    return {
        anchorKey, focusKey, isBackward,
        startKey: isBackward ? focusKey : anchorKey,
        endKey: isBackward ? anchorKey : focusKey
    }
}

function getParentBlockKey ( node: Node ): string | null {
    const parentBlock = node.parentElement.closest ( '[data-block-key]' )
    if ( ! parentBlock ) return null
    const blockKey = parentBlock.getAttribute ( 'data-block-key' )
    return blockKey
}

function calcIsBackward ( contentState: ContentState, anchorKey: string, focusKey: string ) {
    if ( ! anchorKey || ! focusKey ) return false
    if ( anchorKey === focusKey ) return false
    const blockMap = contentState.getBlockMap ()
    const startKey = blockMap.toSeq ().skipUntil ( ( _, key ) => key === anchorKey || key === focusKey ).first ().getKey ()
    const isBackward = anchorKey !== startKey
    return isBackward
}
