import { BlockMap, ContentBlock } from 'draft-js'


// Self included
export default function getFirstAncestorByDepth ( blockMap: BlockMap, targetKey: string, depth: number ): ContentBlock {
    const targetBlock = blockMap.get ( targetKey )
    if ( targetBlock.getDepth () === depth )
        return targetBlock

    const blocks = blockMap.toArray ()
    let parent: ContentBlock
    for ( const block of blocks ) {
        if ( block.getKey () === targetKey ) return parent
        if ( block.getDepth () === depth ) parent = block
    }
}
