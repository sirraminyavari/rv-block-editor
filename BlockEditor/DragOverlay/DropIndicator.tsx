import { FC, useEffect, useRef } from 'react'

import { DropTarget } from '.'

import styles from './styles.module.scss'


export interface DropIndicatorProps {
    draggingBlockKey: string
    wrapperRect: DOMRect
    innerWrapperRect: DOMRect
    closestInfo?: DropTarget
    onSectorRectsChange ( sectorRects: DOMRect [] ): void
}

/**
 * A horizontal line indicating where the current dragging Content Block will appear after dropping it.
 */
const DropIndicator: FC < DropIndicatorProps > = ({
    draggingBlockKey, wrapperRect: wr, innerWrapperRect: iwr,
    closestInfo, onSectorRectsChange
}) => {
    const { rect: cr, insertionMode, prevPosInfo } = closestInfo || {}
    const maxDepth = prevPosInfo?.contentBlock.getDepth () + 1 // FIXME: Handle the first block scenario

    const dropIndicatorRef = useRef < HTMLDivElement > ()
    useEffect ( () => {
        if ( ! dropIndicatorRef.current ) return onSectorRectsChange ([])
        const sectorElemes = [ ...dropIndicatorRef.current.querySelectorAll ( `div.${ styles.dropSector }` ) ]
        const sectorRects = sectorElemes.map ( s => s.getBoundingClientRect () )
        onSectorRectsChange ( sectorRects )
    }, [ maxDepth ] )

    if ( ! closestInfo ) return null

    if ( [ closestInfo, prevPosInfo ].map ( i => i?.blockKey ).indexOf ( draggingBlockKey ) >= 0 ) return null
    if ( ! cr || ! wr || ! iwr ) return null

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
            '--inner-wrapper-width': iwr.width
        }}
    >
        { ( new Array ( maxDepth ) ).fill ( null ).map ( ( _, i ) => <div
            key = { i }
            className = { styles.dropSector }
        /> ) }
    </div>
}
export default DropIndicator
