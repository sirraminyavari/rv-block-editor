import { BlockMap, ContentBlock } from 'draft-js'


// Self Excluded
export default function getNextEqualOrShallowerBlock ( blockMap: BlockMap, targetKey: string, depth: number ): ContentBlock {
    const nextEqualOrShallowerBlock = blockMap
        .skipUntil ( ( _, key ) => key === targetKey )
        .skip ( 1 )
        .skipUntil ( b => b.getDepth () <= depth )
        .first ()
    return nextEqualOrShallowerBlock
}
