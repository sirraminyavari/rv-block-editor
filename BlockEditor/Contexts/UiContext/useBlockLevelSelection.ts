import { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react'
import { EditorState } from 'draft-js'

import getSelectionDepth from 'BlockEditor/Lib/getSelectionDepth'
import blsAwareGetBlockRange from 'BlockEditor/Lib/blsAwareGetBlockRange'
import { RtblSelectionState } from './useRtblSelectionState'


export interface BlockLevelSelectionInfo {
    // Whether the user is performing selection on the block level
    enabled: boolean
    // A list of block-keys computed based on native user-selection and selection-depth
    selectedBlockKeys: string []
    // The block with the lowest depth determines selection-depth
    selectionDepth: number
}

export const defaultBlockLevelSelectionInfo: BlockLevelSelectionInfo = {
    enabled: false, selectedBlockKeys: [], selectionDepth: null
}

/**
 * Provides the core functianality for block-level selection.
 */
export default function useBlockLevelSelection (
    editorState: EditorState,
    setEditorState: SetState < EditorState >,
    rtblSelectionState: RtblSelectionState,
    updateRtblSelectionState: () => void,
    disable: boolean
): [ BlockLevelSelectionInfo, SetState < BlockLevelSelectionInfo >, () => void, MutableRefObject < boolean > ] {
    const [ blockLevelSelectionInfo, setBlockLevelSelectionInfo ] = useState < BlockLevelSelectionInfo > ( defaultBlockLevelSelectionInfo )
    const [ doneInitialSelection, setDoneInitialSelection] = useState ( false )
    const suspend = useRef ( false )

    const disableBls = useCallback ( () => {
        // if ( ! editorState.getSelection ().isCollapsed () )
        //     return // Selection must be collapsed before BLS could be disabled
        console.log ( 'herewekrjwlerk' )
        // const selection = editorState.getSelection ()
        // setEditorState ( EditorState.forceSelection ( editorState, selection.merge ({
        //     focusKey: selection.getAnchorKey (),
        //     focusOffset: 0
        // }) ) )
        // setImmediate ( () => {
            updateRtblSelectionState ()
            setBlockLevelSelectionInfo ( defaultBlockLevelSelectionInfo )
        // } )
    }, [ updateRtblSelectionState ] )

    const contentState = editorState.getCurrentContent ()
    const selectionState = editorState.getSelection ()
    const hasFocus = selectionState.getHasFocus ()

    // Enable Trigger
    useEffect ( () => {
        if ( disable || ! hasFocus || blockLevelSelectionInfo.enabled || suspend.current ) return
        const { anchorKey, focusKey } = rtblSelectionState
        if ( ! anchorKey || ! focusKey ) return
        if ( anchorKey !== focusKey )
            setBlockLevelSelectionInfo ( prevState => ({ ...prevState, enabled: true }) )
    }, [ disable, hasFocus, blockLevelSelectionInfo.enabled, rtblSelectionState ] )

    // Selection Handler
    useEffect ( () => {
        if ( disable || ! hasFocus || ! blockLevelSelectionInfo.enabled || suspend.current ) return

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
    }, [ disable, hasFocus, blockLevelSelectionInfo.enabled, rtblSelectionState, contentState ] )

    // Disable Trigger
    useEffect ( () => {
        if ( disable || ! blockLevelSelectionInfo.enabled ) return
        function disableHandler () {
            if ( doneInitialSelection ) {
                disableBls ()
                setImmediate ( () => setDoneInitialSelection ( false ) )
            }
        }
        function selectEndHandler () {
            if ( ! doneInitialSelection )
                setImmediate ( () => setDoneInitialSelection ( true ) )
        }
        if ( doneInitialSelection ) {
            document.addEventListener ( 'selectstart', disableHandler )
            document.addEventListener ( 'click', disableHandler )
        } else {
            document.addEventListener ( 'mouseup', selectEndHandler )
        }
        return () => {
            document.removeEventListener ( 'mouseup', selectEndHandler )
            document.removeEventListener ( 'selectstart', disableHandler )
            document.removeEventListener ( 'click', disableHandler )
        }
    }, [ disable, hasFocus, blockLevelSelectionInfo.enabled, doneInitialSelection, contentState ] )

    return [ blockLevelSelectionInfo, setBlockLevelSelectionInfo, disableBls, suspend ]
}
