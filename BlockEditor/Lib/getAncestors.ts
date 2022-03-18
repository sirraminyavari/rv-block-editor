import { BlockMap, BlockMapBuilder } from 'draft-js'


/**
 * @returns All ancestors of a ContentBlock in order.
 */
export default function getAncestors ( blockMap: BlockMap, targetKey: string ): BlockMap {
    const targetBlock = blockMap.get ( targetKey )
    const targetDepth = targetBlock.getDepth ()
    if ( ! targetDepth ) return BlockMapBuilder.createFromArray ([])
    const revBlockMap = blockMap.reverse ()
    const trimmedBlockMap = revBlockMap.skipUntil ( ( _, key ) => key === targetKey ).skip ( 1 )
    const parent = trimmedBlockMap.skipUntil ( b => b.getDepth () < targetDepth ).first ()
    return BlockMapBuilder.createFromArray ([ parent ]).merge ( getAncestors ( trimmedBlockMap.reverse () as BlockMap, parent.getKey () ) )
}
