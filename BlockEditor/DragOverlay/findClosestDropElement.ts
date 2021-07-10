/**
 * Finds the Content Block before or after which the current draggin Content Block must move.
 */
export default function findClosestDropElement ( event, draggablesSortedPosInfo ) {
    const { clientY: mouseY } = event
    let prevPosInfo = null
    for ( const posInfo of draggablesSortedPosInfo ) {
        if ( mouseY < posInfo.centerY )
            return { ...posInfo, prevPosInfo, insertionMode: 'before' }
        prevPosInfo = posInfo
    }
    return {
        ...draggablesSortedPosInfo [ draggablesSortedPosInfo.length - 1 ],
        insertionMode: 'after'
    }
}
