import { FC, useState, useRef, useCallback } from 'react'
import cn from 'classnames'
import moveBlockInContentState from 'draft-js/lib/moveBlockInContentState'
import { EditorState } from 'draft-js'
import { useEditorContext } from '../EditorContext'

import styles from './styles.module.scss'


const DragOverlay: FC < any > = () => {
    const { editorState, setEditorState, dragInfo, blockRefs } = useEditorContext ()

    const overlayRef = useRef ( null )

    const [ overlayRect, setOverlayRect ] = useState ( null )
    const [ sortedPosInfo, setSortedPosInfo ] = useState ( null )
    const [ closestInfo, setClosestInfo ] = useState ( null )

    const getClosestInfo = useCallback ( event => {
        if ( ! sortedPosInfo )
            return null
        return findClosestDropElement ( event, sortedPosInfo )
    }, [ sortedPosInfo ] )

    return <div
        ref = { overlayRef }
        className = { cn ( styles.dragOverlay, {
            [ styles.dragging ]: dragInfo.dragging
        } ) }
        onDragEnter = { () => {
            setOverlayRect ( overlayRef.current.getBoundingClientRect () )
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
            const blockToBeMovedKey = dragInfo.elem.getAttribute ( 'data-block-key' )
            const blockToBeMoved = currentContent.getBlockForKey ( blockToBeMovedKey )
            const targetBlockKey = closestElem.getAttribute ( 'data-block-key' )
            const targetBlock = currentContent.getBlockForKey ( targetBlockKey )
            const nextBlock = currentContent [ { before: 'getBlockBefore', after: 'getBlockAfter' } [ insertionMode ] ] ( targetBlockKey )
            if ( // A block cannot be moved next to itself
                blockToBeMoved === targetBlock ||
                blockToBeMoved === nextBlock
            ) return
            const newContent = moveBlockInContentState ( currentContent, blockToBeMoved, targetBlock, insertionMode )
            const newState = EditorState.push ( editorState, newContent, 'move-block' )
            setImmediate ( () => setEditorState ( newState ) )
        } }
    >
        <DropIndicator
            overlayRect = { overlayRect }
            closestInfo = { closestInfo }
        />
    </div>
}
export default DragOverlay

function DropIndicator ({ overlayRect: or, closestInfo }) {
    if ( ! closestInfo ) return null
    const { rect: cr, insertionMode } = closestInfo
    return <div
        className = { styles.dropIndicator }
        style = {{ transform: `translateY( ${ ( cr?.[ { before: 'y', after: 'bottom' } [ insertionMode ] ] || 0 ) - ( or?.y || 0 ) }px )` }}
    />
}

export function findClosestDropElement ( event, draggablesSortedPosInfo ) {
    const { clientY: mouseY } = event
    for ( const posInfo of draggablesSortedPosInfo )
        if ( mouseY < posInfo.centerY )
            return { ...posInfo, insertionMode: 'before' }
    return {
        ...draggablesSortedPosInfo [ draggablesSortedPosInfo.length - 1 ],
        insertionMode: 'after'
    }
}
