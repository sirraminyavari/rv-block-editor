import { BlockMap } from 'draft-js'

import getBlockRange from 'BlockEditor/Lib/getBlockRange'
import getFirstAncestorByDepth from 'BlockEditor/Lib/getFirstAncestorByDepth'
import getLastCousinShallowerThan from 'BlockEditor/Lib/getLastCousinShallowerThan'


export default function blsAwareGetBlockRange ( blockMap: BlockMap, startKey: string, endKey: string, selectionDepth: number ): BlockMap {
    const adjustedStartKey = getFirstAncestorByDepth ( blockMap, startKey, selectionDepth ).getKey ()
    const adjustedEndKey = getLastCousinShallowerThan ( blockMap, endKey, selectionDepth ).getKey ()

    const selectedBlocks = getBlockRange ( blockMap, adjustedStartKey, adjustedEndKey )
    return selectedBlocks
}
