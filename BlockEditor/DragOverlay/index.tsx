import { FC, useState, useCallback } from 'react'
import cn from 'classnames'
import { EditorState } from 'draft-js'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import moveBlock from 'BlockEditor/Lib/moveBlock'

import DropIndicator from './DropIndicator'
import findClosestDropElement from './findClosestDropElement'

import styles from './styles.module.scss'


const DragOverlay: FC < any > = () => {
    const { editorState, setEditorState } = useEditorContext ()
    const { dragInfo, blockRefs, wrapperRef, innerWrapperRef, setBlockControlsInfo } = useUiContext ()

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
            const elems = Object.values ( blockRefs.current ).filter ( Boolean )
            const posInfo = elems.map ( elem => {
                const rect = elem.getBoundingClientRect ()
                const centerY = rect.y + rect.height / 2
                return { elem, rect, centerY }
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
            const currentContent = editorState.getCurrentContent ()
            const draggedBlockKey = dragInfo.elem.getAttribute ( 'data-block-key' )
            const newContent = moveBlock (
                currentContent,
                currentContent.getBlockForKey ( draggedBlockKey ),
                currentContent.getBlockForKey ( closestElem.getAttribute ( 'data-block-key' ) ),
                insertionMode
            )
            const newState = EditorState.push ( editorState, newContent, 'move-block' )
            setEditorState ( newState )
            setImmediate ( () => setBlockControlsInfo ( prev => ({ ...prev,
                hoveredBlockElem: dragInfo.elem as any,
                hoveredBlockKey: draggedBlockKey
            }) ) )
        } }
    >
        <DropIndicator
            wrapperRect = { wrapperRect }
            innerWrapperRect = { innerWrapperRect }
            closestInfo = { closestInfo }
        />
    </div>
}
export default DragOverlay
