import { FC, useState, useCallback } from 'react'
import cn from 'classnames'
import { BlockMap, ContentState, DraftInsertionType, EditorState, SelectionState } from 'draft-js'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext, { BlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'

import blsAwareGetBlockRange from 'BlockEditor/Lib/blsAwareGetBlockRange'
import getBlockRange from 'BlockEditor/Lib/getBlockRange'

import DropIndicator from './DropIndicator'
import findClosestDropElement from './findClosestDropElement'

import styles from './styles.module.scss'


/**
 * This componen overlays the entire outer wrapper when the user starts dragging a Content Block
 * and handles most of the dragging functionality and UI.
 */
const DragOverlay: FC < any > = () => {
    const { editorState, setEditorState } = useEditorContext ()
    const { dragInfo, blockRefs, wrapperRef, innerWrapperRef, setBlockControlsInfo, blockLevelSelectionInfo } = useUiContext ()

    const [ wrapperRect, setWrapperRect ] = useState ( null )
    const [ innerWrapperRect, setInnerWrapperRect ] = useState ( null )
    const [ sortedPosInfo, setSortedPosInfo ] = useState ( null )
    const [ closestInfo, setClosestInfo ] = useState ( null )

    const getClosestInfo = useCallback ( event => {
        if ( ! sortedPosInfo )
            return null
        return findClosestDropElement ( event, sortedPosInfo )
    }, [ sortedPosInfo ] )

    return <div
        className = { cn ( styles.dragOverlay, {
            [ styles.dragging ]: dragInfo.dragging && dragInfo.isDraggingByHandle
        } ) }
        onDragEnter = { () => {
            setWrapperRect ( wrapperRef.current.getBoundingClientRect () )
            setInnerWrapperRect ( innerWrapperRef.current.getBoundingClientRect () )
            const elems = Object.entries ( blockRefs.current ).filter ( ([ , e ]) => e )
            const posInfo = elems.map ( ([ blockKey, elem ]) => {
                const rect = elem.getBoundingClientRect ()
                const centerY = rect.y + rect.height / 2
                return { blockKey, elem, rect, centerY }
            } )
            const sortedPosInfo = posInfo.slice ().sort ( ( a, b ) => a.centerY - b.centerY )
            setSortedPosInfo ( sortedPosInfo )
        } }
        onDragOver = { event => {
            event.preventDefault ()
            setClosestInfo ( getClosestInfo ( event ) )
        } }
        onDrop = { event => {
            const { elem: closestElem, insertionMode } = getClosestInfo ( event )
            const draggedBlockKey = dragInfo.elem.getAttribute ( 'data-block-key' )
            const dropTargetKey = closestElem.getAttribute ( 'data-block-key' )
            const newState = handleDrop ( editorState, blockLevelSelectionInfo, draggedBlockKey, dropTargetKey, insertionMode )
            setEditorState ( newState )
            setImmediate ( () => setBlockControlsInfo ( prev => ({ ...prev,
                hoveredBlockElem: dragInfo.elem as any,
                hoveredBlockKey: draggedBlockKey
            }) ) )
        } }
    >
        <DropIndicator
            draggingBlockKey = { dragInfo?.block?.getKey () }
            wrapperRect = { wrapperRect }
            innerWrapperRect = { innerWrapperRect }
            closestInfo = { closestInfo }
        />
    </div>
}
export default DragOverlay


function handleDrop (
    editorState: EditorState,
    blockLevelSelectionInfo: BlockLevelSelectionInfo,
    draggedBlockKey: string,
    dropTargetKey: string,
    insertionMode: DraftInsertionType
): EditorState {
    const contentState = editorState.getCurrentContent ()
    const blockMap = contentState.getBlockMap ()

    const { startKey, endKey } = getDragRange ( blockMap, blockLevelSelectionInfo, draggedBlockKey )
    const newBlockMap = moveBlockRange ( blockMap, startKey, endKey, dropTargetKey, insertionMode )

    const selection = new SelectionState ({
        anchorKey: startKey, focusKey: endKey,
        anchorOffset: 0, focusOffset: 0,
        isBackward: false, hasFocus: true
    })

    const newContentState = contentState.merge ({
        blockMap: newBlockMap,
        selectionBefore: editorState.getSelection (),
        selectionAfter: selection
    }) as ContentState
    return EditorState.push ( editorState, newContentState, 'move-block' )
}


interface DragRange {
    startKey: string
    endKey: string
}

function getDragRange (
    blockMap: BlockMap,
    { selectionDepth, selectedBlockKeys }: BlockLevelSelectionInfo,
    draggedBlockKey: string
): DragRange {
    const block = blockMap.get ( draggedBlockKey )
    const blockDepth = block.getDepth ()

    if ( blockDepth === selectionDepth )
        return {
            startKey: selectedBlockKeys [ 0 ],
            endKey: selectedBlockKeys [ selectedBlockKeys.length - 1 ]
        }

    const range = blsAwareGetBlockRange ( blockMap, draggedBlockKey, draggedBlockKey, blockDepth )
    return {
        startKey: range.first ().getKey (),
        endKey: range.last ().getKey ()
    }
}

function moveBlockRange (
    blockMap: BlockMap,
    startKey: string,
    endKey: string,
    targetKey: string,
    insertionMode: DraftInsertionType
): BlockMap {
    const range = getBlockRange ( blockMap, startKey, endKey )
    const withoutRangeBlockMap = removeBlockRange ( blockMap, startKey, endKey )

    const before = withoutRangeBlockMap.takeUntil ( ( _, key ) => key === targetKey )
    const after = withoutRangeBlockMap.skipUntil ( ( _, key ) => key === targetKey )

    const borderBlock = after.first ()
    const adjustedBefore = insertionMode === 'before' ? before : before.concat ([[ borderBlock.getKey (), borderBlock ]])
    const adjustedAfter = insertionMode === 'before' ? after : after.skip ( 1 )

    const newBlockMap = adjustedBefore.concat ( range, adjustedAfter ).toOrderedMap ()
    return newBlockMap
}

function removeBlockRange (
    blockMap: BlockMap,
    startKey: string,
    endKey: string
): BlockMap {
    const before = blockMap.takeUntil ( ( _, key ) => key === startKey )
    const after = blockMap.skipUntil ( ( _, key ) => key === endKey ).skip ( 1 )
    const newBlockMap = before.concat ( after ).toOrderedMap ()
    return newBlockMap
}
