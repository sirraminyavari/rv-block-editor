import { FC, useState } from 'react'
import { ContentBlock, DraftInsertionType } from 'draft-js'
import cn from 'classnames'

import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import DropIndicator from './DropIndicator'
import findClosestDropElement from './findClosestDropElement'
import getDropDepth from './getDropDepth'
import handleDrop from './handleDrop'

import styles from './styles.module.scss'


export interface PosInfoItem {
    blockKey: string
    contentBlock: ContentBlock
    elem: HTMLElement
    rect: DOMRect
    centerY: number
}

export interface DropTarget extends PosInfoItem {
    insertionMode: DraftInsertionType
    prevPosInfo?: PosInfoItem
}

/**
 * This component overlays the entire outer wrapper when the user starts dragging a Content Block
 * and handles most of the dragging functionality and UI.
 */
const DragOverlay: FC = () => {
    const { editorState, setEditorState } = useEditorContext ()
    const { dragInfo, blockRefs, wrapperRef, innerWrapperRef, setBlockControlsInfo, blockLevelSelectionInfo } = useUiContext ()

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
                const rect = elem.getBoundingClientRect ()
                const centerY = rect.y + rect.height / 2
                return { blockKey, contentBlock, elem, rect, centerY }
            } ).toArray ()

            setSortedPosInfo ( sortedPosInfo )
            setWrapperRect ( wrapperRef.current.getBoundingClientRect () )
            setInnerWrapperRect ( innerWrapperRef.current.getBoundingClientRect () )
        } }
        onDragOver = { event => {
            event.preventDefault ()
            setClosestInfo ( findClosestDropElement ( event, sortedPosInfo ) )
            setImmediate ( () => setActiveDropSector ( getDropDepth ( event, sectorRects ) ) )
        } }
        onDrop = { event => {
            const { elem: closestElem, insertionMode } = findClosestDropElement ( event, sortedPosInfo )
            const dropSector = getDropDepth ( event, sectorRects )
            const draggedBlockKey = dragInfo.elem.getAttribute ( 'data-block-key' )
            const dropTargetKey = closestElem.getAttribute ( 'data-block-key' )

            const newState = handleDrop (
                editorState,
                blockLevelSelectionInfo,
                draggedBlockKey,
                dropSector,
                dropTargetKey,
                insertionMode
            )

            setEditorState ( newState )
            setWrapperRect ( null )
            setInnerWrapperRect ( null )
            setSortedPosInfo ( null )
            setClosestInfo ( null )
            setSectorRects ([])
            setActiveDropSector ( null )
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
            onSectorRectsChange = { setSectorRects }
            activeSector = { activeDropSector }
        />
    </div>
}
export default DragOverlay
