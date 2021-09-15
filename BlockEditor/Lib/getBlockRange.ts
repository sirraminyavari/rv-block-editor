import { BlockMap } from 'draft-js'


export default function getBlockRange ( blockMap: BlockMap, startKey: string, endKey: string ): BlockMap {
    return blockMap
        .toSeq ()
        .skipUntil ( ( _, key ) => key === startKey )
        .takeUntil ( ( _, key ) => key === endKey )
        .concat ([[ endKey, blockMap.get ( endKey ) ]])
        .toOrderedMap ()
}
