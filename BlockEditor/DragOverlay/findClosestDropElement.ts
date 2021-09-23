import { DragEvent } from 'react'

import { PosInfoItem, DropTarget } from '.'


/**
 * Finds the Content Block before or after which the current draggin Content Block must move.
 */
export default function findClosestDropElement (
    { clientY: mouseY }: DragEvent,
    draggablesSortedPosInfo: PosInfoItem []
): DropTarget | null {
    if ( ! draggablesSortedPosInfo ) return null
    let prevPosInfo = null
    for ( const posInfo of draggablesSortedPosInfo ) {
        if ( mouseY < posInfo.centerY )
            return { ...posInfo, prevPosInfo, insertionMode: 'before' }
        prevPosInfo = posInfo
    }
    return {
        ...draggablesSortedPosInfo [ draggablesSortedPosInfo.length - 1 ],
        prevPosInfo, insertionMode: 'after'
    }
}
