import { EditorState } from 'draft-js'

import { BlockLevelSelectionInfo } from 'BlockEditor/Contexts/UiContext'


export function goDown ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const selectionState = editorState.getSelection ()
    const contentState = editorState.getCurrentContent ()
    const blockMap = contentState.getBlockMap ()
    const { selectionDepth, selectedBlockKeys } = blsInfo

    const newFocusBlock = ( () => {
        if ( selectionState.getIsBackward () ) {
            const trimmedSelectedBlockKeys = selectedBlockKeys.slice ( 0, selectedBlockKeys.indexOf ( selectionState.getAnchorKey () ) + 1 )
            const outerSelectedBlocks = trimmedSelectedBlockKeys.map ( k => blockMap.get ( k ) ).filter ( b => b.getDepth () === selectionDepth )
            const newFocusBlock = outerSelectedBlocks [ 1 ] || contentState.getBlockAfter ( outerSelectedBlocks [ 0 ].getKey () )
            return newFocusBlock
        } else {
            const lastSelectedBlockKey = selectedBlockKeys [ selectedBlockKeys.length - 1 ]
            const nextEqualOrShallowerBlock = blockMap
                .skipUntil ( b => b.getKey () === lastSelectedBlockKey )
                .skip ( 1 )
                .skipUntil ( b => b.getDepth () <= selectionDepth )
                .first ()
            if ( ! nextEqualOrShallowerBlock ) return blockMap.get ( lastSelectedBlockKey )
            return nextEqualOrShallowerBlock
        }
    } ) ()

    const newSelectionState = selectionState.merge ({
        focusKey: newFocusBlock.getKey (),
        focusOffset: 0
    })

    return EditorState.forceSelection ( editorState, newSelectionState )
}

export function goUp ( editorState: EditorState, blsInfo: BlockLevelSelectionInfo ): EditorState {
    const selectionState = editorState.getSelection ()
    const contentState = editorState.getCurrentContent ()
    const blockMap = contentState.getBlockMap ()
    const { selectionDepth, selectedBlockKeys } = blsInfo

    const newFocusBlock = ( () => {
        if ( selectionState.getIsBackward () ) {
            const firstSelectedBlock = selectedBlockKeys [ 0 ]
            const nextEqualOrShallowerBlock = blockMap.reverse ()
                .skipUntil ( b => b.getKey () === firstSelectedBlock )
                .skip ( 1 )
                .skipUntil ( b => b.getDepth () <= selectionDepth )
                .first ()
            if ( ! nextEqualOrShallowerBlock ) return blockMap.get ( firstSelectedBlock )
            return nextEqualOrShallowerBlock
        } else {
            const trimmedSelectedBlockKeys = selectedBlockKeys.slice ( selectedBlockKeys.indexOf ( selectionState.getAnchorKey () ) )
            const outerSelectedBlocks = trimmedSelectedBlockKeys.map ( k => blockMap.get ( k ) ).filter ( b => b.getDepth () === selectionDepth )
            const l = outerSelectedBlocks.length
            const newFocusBlock = blockMap.get ( selectedBlockKeys [ selectedBlockKeys.indexOf ( outerSelectedBlocks [ l - 1 ].getKey () ) - 1 ] )
            return newFocusBlock
        }
    } ) ()

    const newSelectionState = selectionState.merge ({
        focusKey: newFocusBlock.getKey (),
        focusOffset: newFocusBlock.getLength ()
    })

    return EditorState.forceSelection ( editorState, newSelectionState )
}
