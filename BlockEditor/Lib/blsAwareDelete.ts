import { EditorState, SelectionState, ContentState } from 'draft-js'

import { BlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'

import removeBlockRange from './removeBlockRange'
import trimCollapsedBlocks from './trimCollapsedBlocks'


export default function blsAwareDelete ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const contentState = editorState.getCurrentContent ()

    const newBlockMap = removeBlockRange (
        contentState.getBlockMap (),
        blsInfo.selectedBlockKeys [ 0 ],
        blsInfo.selectedBlockKeys [ blsInfo.selectedBlockKeys.length - 1 ]
    )

    const firstSelectedBlockKey = blsInfo.selectedBlockKeys [ 0 ]
    const anchorBlock = trimCollapsedBlocks ( contentState.getBlockMap () ).takeUntil ( b => b.getKey () === firstSelectedBlockKey ).last ()
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
