import { EditorState, ContentState, SelectionState, DraftInsertionType } from 'draft-js'

import { BlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'

import setBlockRangeDepth from 'BlockEditor/Lib/setBlockRangeDepth'
import moveBlockRange from 'BlockEditor/Lib/moveBlockRange'
import getDragRange from './getDragRange'
import getBlockRange from 'BlockEditor/Lib/getBlockRange'
import trimCollapsedBlocks from 'BlockEditor/Lib/trimCollapsedBlocks'


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

    const { anchorKey, focusKey } = ( () => {
        const range = getBlockRange ( movedBlockMap, startKey, endKey )
        const trimmedRange = trimCollapsedBlocks ( range )
        return {
            anchorKey: trimmedRange.first ().getKey (),
            focusKey: trimmedRange.last ().getKey ()
        }
    } ) ()
    const selection = new SelectionState ({
        anchorKey, focusKey,
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
