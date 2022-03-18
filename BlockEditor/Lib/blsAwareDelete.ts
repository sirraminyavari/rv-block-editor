import { EditorState, SelectionState, ContentState, BlockMapBuilder } from 'draft-js'

import { BlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'

import removeBlockRange from './removeBlockRange'
import createEmptyBlock from './createEmptyBlock'
import trimCollapsedBlocks from './trimCollapsedBlocks'


/**
 * Delete a fragment from editor state with BLS taken into account.
 */
export default function blsAwareDelete ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const contentState = editorState.getCurrentContent ()

    const newBlockMap = ( () => {
        const blockMapWithoutRange = removeBlockRange (
            contentState.getBlockMap (),
            blsInfo.selectedBlockKeys [ 0 ],
            blsInfo.selectedBlockKeys [ blsInfo.selectedBlockKeys.length - 1 ]
        )
        if ( blockMapWithoutRange.size ) return blockMapWithoutRange
        return BlockMapBuilder.createFromArray ([ createEmptyBlock () ])
    } ) ()

    const firstSelectedBlockKey = blsInfo.selectedBlockKeys [ 0 ]
    const anchorBlock = trimCollapsedBlocks ( contentState.getBlockMap () ).takeUntil ( ( _, key ) => key === firstSelectedBlockKey ).last ()
        || newBlockMap.first ()
    const newSelectionState = new SelectionState ({
        anchorKey: anchorBlock.getKey (),
        anchorOffset: anchorBlock.getLength (),
        focusKey: anchorBlock.getKey (),
        focusOffset: anchorBlock.getLength (),
        isBackward: false, hasFocus: true
    })

    const newContentState = contentState.merge ({
        blockMap: newBlockMap,
        selectionBefore: editorState.getSelection (),
        selectionAfter: newSelectionState
    }) as ContentState

    return EditorState.push ( editorState, newContentState, 'remove-range' )
}
