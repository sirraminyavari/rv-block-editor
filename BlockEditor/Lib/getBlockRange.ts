import { BlockMap } from 'draft-js'


export default function getBlockRange ( blockMap: BlockMap, startKey: string, endKey: string ): BlockMap {
    return blockMap
        .skipUntil ( ( _, key ) => key === startKey )
        .takeUntil ( ( _, key ) => key === endKey )
        .concat ([[ endKey, blockMap.get ( endKey ) ]])
        .toOrderedMap ()
}
