import { EditorState, ContentState, SelectionState, BlockMap, DraftInsertionType } from 'draft-js'
import { BlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'

import blsAwareGetBlockRange from 'BlockEditor/Lib/blsAwareGetBlockRange'
import setBlockRangeDepth from 'BlockEditor/Lib/setBlockRangeDepth'
import moveBlockRange from 'BlockEditor/Lib/moveBlockRange'


export default function handleDrop (
    editorState: EditorState,
    blockLevelSelectionInfo: BlockLevelSelectionInfo,
    draggedBlockKey: string,
    sector: number,
    dropTargetKey: string,
    insertionMode: DraftInsertionType
): EditorState {
    const contentState = editorState.getCurrentContent ()
    const blockMap = contentState.getBlockMap ()

    const { startKey, endKey } = getDragRange ( blockMap, blockLevelSelectionInfo, draggedBlockKey )
    const depthAdjustedBlockMap = setBlockRangeDepth ( blockMap, startKey, endKey, sector )
    const movedBlockMap = moveBlockRange ( depthAdjustedBlockMap, startKey, endKey, dropTargetKey, insertionMode )

    const selection = new SelectionState ({
        anchorKey: startKey, focusKey: endKey,
        anchorOffset: 0, focusOffset: 0,
        isBackward: false, hasFocus: true
    })

    const newContentState = contentState.merge ({
        blockMap: movedBlockMap,
        selectionBefore: editorState.getSelection (),
        selectionAfter: selection
    }) as ContentState
    return EditorState.push ( editorState, newContentState, 'move-block' )
}

interface DragRange {
    startKey: string
    endKey: string
}

function getDragRange (
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
