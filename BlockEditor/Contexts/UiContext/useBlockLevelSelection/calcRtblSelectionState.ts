import { ContentState } from 'draft-js'

import { RtblSelectionState } from '.'


export default function calcRtblSelectionState ( contentState: ContentState, domSelection: Selection ): RtblSelectionState {
    const anchorKey = getParentBlockKey ( domSelection.anchorNode )
    const focusKey = getParentBlockKey ( domSelection.focusNode )
    const isBackward = calcIsBackward ( contentState, anchorKey, focusKey )
    return {
        anchorKey, focusKey, isBackward,
        startKey: isBackward ? focusKey : anchorKey,
        endKey: isBackward ? anchorKey : focusKey
    }
}

export function getParentBlockKey ( node: Node ): string | null {
    const parentBlock = node.parentElement.closest ( '[data-block-key]' )
    if ( ! parentBlock ) return null
    const blockKey = parentBlock.getAttribute ( 'data-block-key' )
    return blockKey
}

export function calcIsBackward ( contentState: ContentState, anchorKey: string, focusKey: string ) {
    if ( ! anchorKey || ! focusKey ) return false
    if ( anchorKey === focusKey ) return false
    const blockMap = contentState.getBlockMap ()
    const startKey = blockMap.toSeq ().skipUntil ( ( _, key ) => key === anchorKey || key === focusKey ).first ().getKey ()
    const isBackward = anchorKey !== startKey
    return isBackward
}
