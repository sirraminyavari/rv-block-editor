import { BlockMap } from 'draft-js'

import getBlockRange from 'BlockEditor/Lib/getBlockRange'


export default function getSelectionDepth ( blockMap: BlockMap, startKey: string, endKey: string ): number {
    const rawSelectedBlocks = getBlockRange ( blockMap, startKey, endKey )
    const selectionDepth = rawSelectedBlocks.toArray ().map ( b => b.getDepth () ).sort () [ 0 ]
    return selectionDepth
}
