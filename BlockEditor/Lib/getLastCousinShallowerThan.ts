import { BlockMap, ContentBlock } from 'draft-js'


// Self included
export default function getLastCousinShallowerThan ( blockMap: BlockMap, targetKey: string, depth: number ): ContentBlock {
    const trimmedBlockSeq = blockMap.skipUntil ( ( _, key ) => key === targetKey )
    const targetBlock = trimmedBlockSeq.first ()
    if ( targetBlock.getDepth () === depth ) {
        const remainingBlockSeq = trimmedBlockSeq.skip ( 1 )
        const nextBlock = remainingBlockSeq.first ()
        if ( ! nextBlock ) return targetBlock
        if ( nextBlock.getDepth () <= depth ) return targetBlock
        return getLastCousinShallowerThan ( remainingBlockSeq.toOrderedMap (), nextBlock.getKey (), depth )
    }
    return trimmedBlockSeq.takeUntil ( block => block.getDepth () <= depth ).last ()
}
