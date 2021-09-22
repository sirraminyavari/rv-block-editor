import { FC } from 'react'

import { DropTarget } from '.'

import styles from './styles.module.scss'


export interface DropIndicatorProps {
    draggingBlockKey: string
    wrapperRect: DOMRect
    innerWrapperRect: DOMRect
    closestInfo: DropTarget
}

/**
 * A horizontal line indicating where the current dragging Content Block will appear after dropping it.
 */
const DropIndicator: FC < DropIndicatorProps > = ({ draggingBlockKey, wrapperRect: wr, innerWrapperRect: iwr, closestInfo }) => {
    if ( ! closestInfo ) return null
    const { rect: cr, insertionMode, prevPosInfo } = closestInfo
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

    const maxDepth = prevPosInfo.contentBlock.getDepth () + 1

    return <div
        className = { styles.dropIndicator }
        style = {{ // @ts-ignore
            '--offset': offset,
            '--x': iwr.x - wr.x,
            '--inner-wrapper-width': iwr.width
        }}
    >
        { ( new Array ( maxDepth ) ).fill ( null ).map ( () => <div
            className = { styles.dropSector }
        /> ) }
    </div>
}
export default DropIndicator
