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

    const { adjustedTargetKey, adjustedInsertionMode } = ( () => {
        const isInplace = range.some ( b => b.getKey () === targetKey )
        if ( ! isInplace ) return { adjustedTargetKey: targetKey, adjustedInsertionMode: insertionMode }

        const firstInRangeKey = range.first ().getKey ()
        const blockBefore = blockMap.takeUntil ( b => b.getKey () === firstInRangeKey ).last ()
        if ( blockBefore ) return { adjustedTargetKey: blockBefore.getKey (), adjustedInsertionMode: 'after' }

        const lastInRangeKey = range.last ().getKey ()
        const blockAfter = blockMap.skipUntil ( b => b.getKey () === lastInRangeKey ).skip ( 1 ).first ()
        if ( blockAfter ) return { adjustedTargetKey: blockAfter.getKey (), adjustedInsertionMode: 'before' }

        throw new Error ( "Illegal: Moving the whole content" )
    } ) ()

    const before = withoutRangeBlockMap.takeUntil ( ( _, key ) => key === adjustedTargetKey )
    const after = withoutRangeBlockMap.skipUntil ( ( _, key ) => key === adjustedTargetKey )

    const borderBlock = after.first ()
    const adjustedBefore = adjustedInsertionMode === 'before' ? before : before.concat ([[ borderBlock.getKey (), borderBlock ]])
    const adjustedAfter = adjustedInsertionMode === 'before' ? after : after.skip ( 1 )

    const newBlockMap = adjustedBefore.concat ( range, adjustedAfter ).toOrderedMap ()
    return newBlockMap
}
