import { EditorState } from 'draft-js'

import { BlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'


export function goDown ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const selectionState = editorState.getSelection ()
    if ( ! selectionState.getIsBackward () ) throw new Error ( "Selection must be backward" )
    const contentState = editorState.getCurrentContent ()
    const blockMap = contentState.getBlockMap ()
    const { selectionDepth, selectedBlockKeys } = blsInfo

    const trimmedSelectedBlockKeys = selectedBlockKeys.slice ( 0, selectedBlockKeys.indexOf ( selectionState.getAnchorKey () ) + 1 )
    const outerSelectedBlocks = trimmedSelectedBlockKeys.map ( k => blockMap.get ( k ) ).filter ( b => b.getDepth () === selectionDepth )
    const newFocusBlock = outerSelectedBlocks [ 1 ] || contentState.getBlockAfter ( outerSelectedBlocks [ 0 ].getKey () )

    const newSelectionState = selectionState.merge ({
        focusKey: newFocusBlock.getKey (),
        focusOffset: 0
    })

    return EditorState.forceSelection ( editorState, newSelectionState )
}

export function goUp ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const selectionState = editorState.getSelection ()
    if ( selectionState.getIsBackward () ) throw new Error ( "Selection must be forward" )
    const contentState = editorState.getCurrentContent ()
    const blockMap = contentState.getBlockMap ()
    const { selectionDepth, selectedBlockKeys } = blsInfo

    const trimmedSelectedBlockKeys = selectedBlockKeys.slice ( selectedBlockKeys.indexOf ( selectionState.getAnchorKey () ) )
    const outerSelectedBlocks = trimmedSelectedBlockKeys.map ( k => blockMap.get ( k ) ).filter ( b => b.getDepth () === selectionDepth )
    const l = outerSelectedBlocks.length
    const newFocusBlock = outerSelectedBlocks [ l - 2 ] || contentState.getBlockBefore ( outerSelectedBlocks [ l - 1 ].getKey () )

    const newSelectionState = selectionState.merge ({
        focusKey: newFocusBlock.getKey (),
        focusOffset: newFocusBlock.getLength ()
    })

    return EditorState.forceSelection ( editorState, newSelectionState )
}
