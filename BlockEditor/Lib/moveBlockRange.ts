import { BlockMap, DraftInsertionType } from 'draft-js'

import getBlockRange from './getBlockRange'
import removeBlockRange from './removeBlockRange'


export default function moveBlockRange (
    blockMap: BlockMap,
    startKey: string,
    endKey: string,
    targetKey: string,
    insertionMode: DraftInsertionType
): BlockMap {
    const range = getBlockRange ( blockMap, startKey, endKey )
    const withoutRangeBlockMap = removeBlockRange ( blockMap, startKey, endKey )

    const before = withoutRangeBlockMap.takeUntil ( ( _, key ) => key === targetKey )
    const after = withoutRangeBlockMap.skipUntil ( ( _, key ) => key === targetKey )

    const borderBlock = after.first ()
    const adjustedBefore = insertionMode === 'before' ? before : before.concat ([[ borderBlock.getKey (), borderBlock ]])
    const adjustedAfter = insertionMode === 'before' ? after : after.skip ( 1 )

    const newBlockMap = adjustedBefore.concat ( range, adjustedAfter ).toOrderedMap ()
    return newBlockMap
}
