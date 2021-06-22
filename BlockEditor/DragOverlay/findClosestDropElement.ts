export default function findClosestDropElement ( event, draggablesSortedPosInfo ) {
    const { clientY: mouseY } = event
    for ( const posInfo of draggablesSortedPosInfo )
        if ( mouseY < posInfo.centerY )
            return { ...posInfo, insertionMode: 'before' }
    return {
        ...draggablesSortedPosInfo [ draggablesSortedPosInfo.length - 1 ],
        insertionMode: 'after'
    }
}
