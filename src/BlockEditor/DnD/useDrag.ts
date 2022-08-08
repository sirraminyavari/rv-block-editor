import { useState } from 'react'
import { ContentBlock } from 'draft-js'

/**
 * Information regarding the D&D functionality at the block level.
 */
export interface DragInfo {
    // Whether a block is being dragged
    dragging: boolean
    // Whether the current drag has been started via one of the drag handles
    isDraggingByHandle: boolean
    // The block that is currently being dragged
    block?: ContentBlock
    // Ref to the wrapper of the block that is currently being dragged
    elem?: HTMLElement
}

export default function useDrag(): [DragInfo, SetState<DragInfo>] {
    const [dragInfo, setDragInfo] = useState({
        dragging: false,
        isDraggingByHandle: false,
        block: null,
        elem: null,
    })
    return [dragInfo, setDragInfo]
}
