import { FC, useState, useRef, useCallback } from 'react'
import cn from 'classnames'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'
import { EditorState } from 'draft-js'
import { useEditorContext } from '../EditorContext'

import styles from './styles.module.scss'


const DragOverlay: FC < any > = () => {
    const { editorState, setEditorState, dragInfo, blockRefs } = useEditorContext ()

    const overlayRef = useRef ( null )
    const [ overlayRect, setOverlayRect ] = useState ({ y: 0 })
    const [ closestRect, setClosestRect ] = useState ( null )

    const getClosest = useCallback ( event => findClosestDropElement ( event, Object.values ( blockRefs.current ).filter ( Boolean ) ), [] )

    return <div
        ref = { overlayRef }
        className = { cn ( styles.dragOverlay, {
            [ styles.dragging ]: dragInfo.dragging
        } ) }
        onDragEnter = { () => {
            setOverlayRect ( overlayRef.current.getBoundingClientRect () )
        } }
        onDragOver = { event => {
            event.preventDefault ()
            const closest = getClosest ( event )
            if ( ! closest ) return
            setClosestRect ( closest.getBoundingClientRect () )
        } }
        onDrop = { event => {
            const closest = getClosest ( event )
            const currentContent = editorState.getCurrentContent ()
            const blockToBeMovedKey = dragInfo.elem.getAttribute ( 'data-block-key' )
            const blockToBeMoved = currentContent.getBlockForKey ( blockToBeMovedKey )
            const targetBlockKey = closest.getAttribute ( 'data-block-key' )
            const targetBlock = currentContent.getBlockForKey ( targetBlockKey )
            if ( // Block cannot be moved next to itself
                blockToBeMoved === targetBlock ||
                blockToBeMoved === currentContent.getBlockBefore ( targetBlockKey )
            ) return
            const newContent = moveBlockInContentState ( currentContent, blockToBeMoved, targetBlock, 'before' )
            const newState = EditorState.push ( editorState, newContent, 'move-block' )
            setImmediate ( () => setEditorState ( newState ) )
        } }
    >
        <div
            className = { styles.dropIndicator }
            style = {{ transform: `translateY( ${ ( closestRect?.y || 0 ) - overlayRect.y }px )` }}
        />
    </div>
}
export default DragOverlay


export function findClosestDropElement ( event, draggables ) {
    const { clientY: mouseY } = event
    const closest = draggables.reduce ( ( closest, draggable ) => {
        const { y: draggableY, height: draggableHeight } = draggable.getBoundingClientRect ()
        const centerY = draggableY + draggableHeight / 2
        const offset = centerY - mouseY
        if ( offset >= 0 && offset < closest.offset  )
            return { offset, elem: draggable }
        return closest
    }, { offset: Infinity } )
    return closest.elem
}
