import { DragEvent } from 'react'


export default function getDropDepth (
    { clientX: mouseX }: DragEvent,
    sectorRects: DOMRect []
): number | null {
    if ( ! sectorRects.length ) return null
    const len = sectorRects.length
    for ( let i = 0; i < len; i ++ ) {
        const sectorRect = sectorRects [ i ]
        if ( sectorRect.x >= mouseX )
            return i ? i - 1 : 0
    }
    return len - 1
}
