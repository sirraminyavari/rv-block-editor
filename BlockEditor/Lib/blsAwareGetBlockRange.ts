import { BlockMap } from 'draft-js'

import getSelectionDepth from 'BlockEditor/Lib/getSelectionDepth'
import trimCollapsedBlocks from 'BlockEditor/Lib/trimCollapsedBlocks'
import getFirstAncestorByDepth from 'BlockEditor/Lib/getFirstAncestorByDepth'
import getLastCousinShallowerThan from 'BlockEditor/Lib/getLastCousinShallowerThan'
import getBlockRange from 'BlockEditor/Lib/getBlockRange'


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
