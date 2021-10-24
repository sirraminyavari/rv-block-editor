import { FC, useState } from 'react'
import { createPortal } from 'react-dom'
import { ContentBlock, DraftInsertionType } from 'draft-js'
import cn from 'classnames'

import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import DropIndicator from './DropIndicator'
import findClosestDropElement from './findClosestDropElement'
import getDropSector from './getDropSector'
import { calcMinDepth } from './calcDepthConstraints'
import handleDrop from './handleDrop'

import styles from './styles.module.scss'


export interface PosInfoItem {
    blockKey: string
    contentBlock: ContentBlock
    elem: HTMLElement
    rect: DOMRect
    centerY: number
    notAcceptingChildren: boolean
}

export interface DropTarget extends PosInfoItem {
    insertionMode: DraftInsertionType
    prevPosInfo?: PosInfoItem
    nextPosInfo?: PosInfoItem
}

/**
 * This component overlays the entire outer wrapper when the user starts dragging a Content Block
 * and handles most of DnD's functionality and UI.
 */
const DragOverlay: FC = () => {
    const { editorState, setEditorState } = useEditorContext ()
    const { dragInfo, blockRefs, wrapperRef, innerWrapperRef, setBlockControlsInfo, blockLevelSelectionInfo, portalNode } = useUiContext ()

    const [ wrapperRect, setWrapperRect ] = useState < DOMRect > ( null )
    const [ innerWrapperRect, setInnerWrapperRect ] = useState < DOMRect > ( null )
    const [ sortedPosInfo, setSortedPosInfo ] = useState < PosInfoItem [] > ( null )
    const [ closestInfo, setClosestInfo ] = useState < DropTarget > ( null )
    const [ sectorRects, setSectorRects ] = useState < DOMRect [] > ([])
    const [ activeDropSector, setActiveDropSector ] = useState < number > ( null )

    return <div
        className = { cn ( styles.dragOverlay, {
            [ styles.dragging ]: dragInfo.dragging && dragInfo.isDraggingByHandle
        } ) }
        onDragEnter = { () => {
            const blockMap = editorState.getCurrentContent ().getBlockMap ()
            const sortedPosInfo: PosInfoItem [] = blockMap.map ( ( contentBlock, blockKey ) => {
                const elem = blockRefs.current [ blockKey ]
                if ( ! elem ) return null
                const rect = elem.getBoundingClientRect ()
                const centerY = rect.y + rect.height / 2
                return {
                    blockKey, contentBlock, elem, rect, centerY,
                    notAcceptingChildren: !! contentBlock.getData ().get ( '_collapsed' )
                }
            } ).toArray ().filter ( Boolean )

            setSortedPosInfo ( sortedPosInfo )
            setWrapperRect ( wrapperRef.current.getBoundingClientRect () )
            setInnerWrapperRect ( innerWrapperRef.current.getBoundingClientRect () )
        } }
        onDragOver = { event => {
            event.preventDefault ()
            setClosestInfo ( findClosestDropElement ( event, sortedPosInfo ) )
            setImmediate ( () => setActiveDropSector ( getDropSector ( event, sectorRects ) ) )
        } }
        onDrop = { event => {
            const closestDropElement = findClosestDropElement ( event, sortedPosInfo )
            if ( closestDropElement ) {
                const { elem: closestElem, insertionMode } = closestDropElement
                const dropSector = getDropSector ( event, sectorRects )
                const dropDepth = dropSector + calcMinDepth ( closestDropElement )
                const draggedBlockKey = dragInfo.elem.getAttribute ( 'data-block-key' )
                const dropTargetKey = closestElem.getAttribute ( 'data-block-key' )

                const newState = handleDrop (
                    editorState,
                    blockLevelSelectionInfo,
                    draggedBlockKey,
                    dropDepth,
                    dropTargetKey,
                    insertionMode
                )
                setEditorState ( newState )

                setImmediate ( () => setBlockControlsInfo ( prev => ({
                    ...prev,
                    hoveredBlockElem: dragInfo.elem as any,
                    hoveredBlockKey: draggedBlockKey
                }) ) )
            }

            setWrapperRect ( null )
            setInnerWrapperRect ( null )
            setSortedPosInfo ( null )
            setClosestInfo ( null )
            setSectorRects ([])
            setActiveDropSector ( null )
        } }
    >
        { dragInfo.dragging && <>
            <DropIndicator
                draggingBlockKey = { dragInfo?.block?.getKey () }
                wrapperRect = { wrapperRect }
                innerWrapperRect = { innerWrapperRect }
                closestInfo = { closestInfo }
                onSectorRectsChange = { setSectorRects }
                activeSector = { activeDropSector }
            />
            { createPortal ( <div className = { styles.dndShield } />, portalNode ) }
        </> }
    </div>
}
export default DragOverlay
