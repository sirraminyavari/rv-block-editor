import { BlockMap } from 'draft-js'

import getSelectionDepth from 'BlockEditor/Lib/getSelectionDepth'
import getFirstAncestorByDepth from 'BlockEditor/Lib/getFirstAncestorByDepth'
import getLastCousinShallowerThan from 'BlockEditor/Lib/getLastCousinShallowerThan'
import getBlockRange from 'BlockEditor/Lib/getBlockRange'


export default function blsAwareGetBlockRange (
    blockMap: BlockMap,
    startKey: string,
    endKey: string,
    selectionDepth: number = getSelectionDepth ( blockMap, startKey, endKey )
): BlockMap {
    const adjustedStartKey = getFirstAncestorByDepth ( blockMap, startKey, selectionDepth ).getKey ()
    const adjustedEndKey = getLastCousinShallowerThan ( blockMap, endKey, selectionDepth ).getKey ()
    return getBlockRange ( blockMap, adjustedStartKey, adjustedEndKey )
}
