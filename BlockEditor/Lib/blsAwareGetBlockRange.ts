import { BlockMap, BlockMapBuilder } from 'draft-js'

import getSelectionDepth from 'BlockEditor/Lib/getSelectionDepth'
import getBlockRange from 'BlockEditor/Lib/getBlockRange'
import getFirstAncestorByDepth from 'BlockEditor/Lib/getFirstAncestorByDepth'
import getLastCousinShallowerThan from 'BlockEditor/Lib/getLastCousinShallowerThan'


export default function blsAwareGetBlockRange (
    blockMap: BlockMap,
    startKey: string,
    endKey: string,
    selectionDepth: number = getSelectionDepth ( blockMap, startKey, endKey )
): BlockMap {
    const trimmedBlockMap = trimCollapsedBlocks ( blockMap )

    const adjustedStartKey = getFirstAncestorByDepth ( trimmedBlockMap, startKey, selectionDepth ).getKey ()
    const adjustedEndKey = getLastCousinShallowerThan ( trimmedBlockMap, endKey, selectionDepth ).getKey ()

    const selectedBlocks = getBlockRange ( blockMap, adjustedStartKey, adjustedEndKey )
    return selectedBlocks
}


function trimCollapsedBlocks ( blockMap: BlockMap ): BlockMap {
    if ( ! blockMap.size ) return blockMap
    const safeLeft = blockMap.takeUntil ( b => !! b.getData ().get ( '_collapsed' ) ) as BlockMap
    const lastSafeBlockKey = safeLeft.last ()?.getKey ()
    const right = blockMap.skipUntil ( b => b.getKey () === lastSafeBlockKey ).skip ( 1 ) as BlockMap
    const firstCollapsedBlock = right.first ()
    if ( ! firstCollapsedBlock?.getData ().get ( '_collapsed' ) ) return safeLeft
    const lastCollapsedKey = getLastCousinShallowerThan (
        right,
        firstCollapsedBlock.getKey (),
        firstCollapsedBlock.getDepth ()
    ).getKey ()
    const rest = blockMap.skipUntil ( b => b.getKey () === lastCollapsedKey ).skip ( 1 ) as BlockMap
    return safeLeft.merge ( BlockMapBuilder.createFromArray ([ firstCollapsedBlock ]), trimCollapsedBlocks ( rest ) )
}
