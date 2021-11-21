import { DragEvent } from 'react'
import { EditorState } from 'draft-js'

import { DragInfo } from 'BlockEditor/Contexts/UiContext'
import getDescendents from 'BlockEditor/Lib/getDescendents'

import { PosInfoItem, DropTarget } from '.'


/**
 * Finds the Content Block before or after which the current draggin Content Block must move.
 */
export default function findClosestDropElement (
    { clientY: mouseY }: DragEvent,
    editorState: EditorState,
    dragInfo: DragInfo,
    draggablesSortedPosInfo: PosInfoItem []
): DropTarget | null {
    if ( ! draggablesSortedPosInfo ) return null

    const tdspi = ( () => { // Trimmed Draggables Sorted PosInfo
        const draggingBlockKey = dragInfo.block.getKey ()
        const descendentKeys = getDescendents ( editorState.getCurrentContent ().getBlockMap (), draggingBlockKey ).keySeq ().toArray ()
        return draggablesSortedPosInfo.filter ( info => ! descendentKeys.some ( dk => dk === info.blockKey ) )
    } ) ()

    let prevPosInfo = null
    for ( const posInfo of tdspi ) {
        if ( mouseY < posInfo.centerY ) {
            if ( prevPosInfo?.notAcceptingChildren ) return null
            return {
                ...posInfo,
                prevPosInfo,
                nextPosInfo: tdspi [ tdspi.indexOf ( posInfo ) + 1 ],
                insertionMode: 'before'
            }
        }
        prevPosInfo = posInfo
    }

    const lastPosInfo = tdspi [ tdspi.length - 1 ]
    if ( lastPosInfo.notAcceptingChildren ) return null
    return { ...lastPosInfo, prevPosInfo, insertionMode: 'after' }
}
