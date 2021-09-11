import { EditorState, ContentState, BlockMap, ContentBlock } from 'draft-js'
import { getSelectedBlocksMap } from 'draftjs-utils'
import { EditorPlugin } from 'BlockEditor'
import clamp from 'clamp'


export interface Config {
    maxDepth: number
}

/**
 * Proviedes block-nesting functionality for the entire editor.
 */
export default function createNestingPlugin ( { maxDepth }: Config ): EditorPlugin {
    return {
        id: '__internal__nesting',
        keyBindingFn ( event ) {
            return event.ctrlKey
                ? event.key === ']'
                    ? 'indent-blocks'
                    : event.key === '['
                        ? 'outdent-blocks'
                        : null
                : null
        },
        handleKeyCommand ( command, editorState, _, { setEditorState } ) {
            if ( command !== 'indent-blocks' && command !== 'outdent-blocks' )
                return 'not-handled'

            const contentState = editorState.getCurrentContent ()
            const selectionState = editorState.getSelection ()

            const selectedBlocks = getSelectedBlocksMap ( editorState ) as BlockMap
            const adjust = { 'indent-blocks': 1, 'outdent-blocks': -1 } [ command ]

            const newBlocks = selectedBlocks.map ( block => adjustDepth ( block, adjust, maxDepth ) )
            const newBlockMap = contentState.getBlockMap ().merge ( newBlocks as any )
            const newContentState = contentState.merge ({
                blockMap: newBlockMap,
                selectionBefore: selectionState,
                selectionAfter: selectionState
            }) as ContentState

            const newEditorState = EditorState.push ( editorState, newContentState, 'adjust-depth' )
            setEditorState ( newEditorState )
            return 'not-handled'
        }
    }
}

function adjustDepth ( block: ContentBlock, adjust: number, maxDepth: number ): ContentBlock {
    const currentDepth = block.getDepth ()
    const adjustedDepth = clamp ( currentDepth + adjust, 0, maxDepth )
    return block.set ( 'depth', adjustedDepth ) as ContentBlock
}
