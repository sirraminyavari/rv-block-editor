
import { BlockMap } from 'draft-js'

import { BlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'
import blsAwareGetBlockRange from 'BlockEditor/Lib/blsAwareGetBlockRange'


interface DragRange {
    startKey: string
    endKey: string
}

export default function getDragRange (
    blockMap: BlockMap,
    { selectionDepth, selectedBlockKeys }: BlockLevelSelectionInfo,
    draggedBlockKey: string
): DragRange {
    const block = blockMap.get ( draggedBlockKey )
    const blockDepth = block.getDepth ()

    if ( blockDepth === selectionDepth )
        return {
            startKey: selectedBlockKeys [ 0 ],
            endKey: selectedBlockKeys [ selectedBlockKeys.length - 1 ]
        }

    const range = blsAwareGetBlockRange ( blockMap, draggedBlockKey, draggedBlockKey, blockDepth )
    return {
        startKey: range.first ().getKey (),
        endKey: range.last ().getKey ()
    }
}
