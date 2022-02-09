import { FC, useLayoutEffect, useRef } from 'react'
import cn from 'classnames'

import { DropTarget } from '.'
import { calcMinDepth, calcMaxDepth } from './calcDepthConstraints'

import * as styles from './styles.module.scss'


export interface DropIndicatorProps {
    draggingBlockKey: string
    wrapperRect: DOMRect
    innerWrapperRect: DOMRect
    closestInfo?: DropTarget
    onSectorRectsChange ( sectorRects: DOMRect [] ): void
    activeSector: number | null
}

/**
 * A horizontal line indicating where the current dragging Content Block will appear after dropping it.
 */
const DropIndicator: FC < DropIndicatorProps > = ({
    draggingBlockKey, wrapperRect: wr, innerWrapperRect: iwr,
    closestInfo, onSectorRectsChange, activeSector
}) => {
    const { rect: cr, insertionMode, prevPosInfo } = closestInfo || {}

    const minDepth = calcMinDepth ( closestInfo )
    const maxDepth = calcMaxDepth ( closestInfo )

    const dropIndicatorRef = useRef < HTMLDivElement > ()
    useLayoutEffect ( () => {
        if ( ! dropIndicatorRef.current ) return onSectorRectsChange ([])
        const sectorElemes = [ ...dropIndicatorRef.current.getElementsByClassName ( styles.dropSector ) ]
        const sectorRects = sectorElemes.map ( s => s.getBoundingClientRect () )
        onSectorRectsChange ( sectorRects )
    }, [ maxDepth, dropIndicatorRef.current ] )

    if ( // Illegal Cases
        ! closestInfo ||
        // Dragging the first block before itself
        ( ! prevPosInfo && closestInfo.blockKey === draggingBlockKey ) ||
        // Dragging a block next to itself
        prevPosInfo?.blockKey === draggingBlockKey ||
        // One of the critical rects is not provided
        ! cr || ! wr || ! iwr
    ) return null

    const offset = ( () => {
        if ( insertionMode === 'after' )
            return cr.bottom + 10 - wr.y
        if ( ! prevPosInfo )
            return cr.y - 10 - wr.y
        const { rect: pr } = prevPosInfo
        return ( pr.bottom + cr.y ) / 2 - wr.y
    } ) ()

    return <div
        ref = { dropIndicatorRef }
        className = { styles.dropIndicator }
        style = {{ // @ts-ignore
            '--offset': offset,
            '--x': iwr.x - wr.x,
            '--inner-wrapper-width': iwr.width,
            '--min-depth': minDepth
        }}
    >
        { ( new Array ( maxDepth - minDepth + 1 ) ).fill ( null ).map ( ( _, i ) => <div
            key = { i }
            className = { cn ( styles.dropSector, {
                [ styles.active ]: activeSector === i
            } ) }
        /> ) }
    </div>
}
export default DropIndicator
