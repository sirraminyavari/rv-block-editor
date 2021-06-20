import { FC, useState, useRef, useCallback } from 'react'
import cn from 'classnames'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'
import { EditorState } from 'draft-js'

import findClosestDropElement from '../utils/findClosestDropElement'
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
            const blockToBeMoved = currentContent.getBlockForKey ( dragInfo.elem.getAttribute ( 'data-block-key' ) )
            const targetBlock = currentContent.getBlockForKey ( closest.getAttribute ( 'data-block-key' ) )
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
