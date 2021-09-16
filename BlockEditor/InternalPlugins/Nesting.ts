import { EditorState, ContentState, BlockMap, ContentBlock } from 'draft-js'
import { EditorPlugin } from 'BlockEditor'
import clamp from 'clamp'

import blsAwareGetBlockRange from 'BlockEditor/Lib/blsAwareGetBlockRange'


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
            if ( ! event.ctrlKey ) return
            return { ']': 'indent-blocks', '[': 'outdent-blocks' } [ event.key ]
        },
        handleKeyCommand ( command, editorState, _, { setEditorState } ) {
            if ( command !== 'indent-blocks' && command !== 'outdent-blocks' )
                return 'not-handled'

            const contentState = editorState.getCurrentContent ()
            const blockMap = contentState.getBlockMap ()
            const selectionState = editorState.getSelection ()

            const selectedBlocks = blsAwareGetBlockRange ( blockMap, selectionState.getStartKey (), selectionState.getEndKey () )
            const adjust = { 'indent-blocks': 1, 'outdent-blocks': -1 } [ command ]

            if ( command === 'indent-blocks' && ! validateIndentation ( contentState, selectedBlocks ) )
                return 'not-handled'

            const newBlocks = selectedBlocks.map ( block => adjustDepth ( block, adjust, maxDepth ) )
            const newBlockMap = contentState.getBlockMap ().merge ( newBlocks as any )
            const newContentState = contentState.merge ({ blockMap: newBlockMap }) as ContentState

            const newEditorState = EditorState.push ( editorState, newContentState, 'adjust-depth' )
            setEditorState ( newEditorState )
            return 'not-handled'
        }
    }
}

function validateIndentation ( contentState: ContentState, selectedBlocks: BlockMap ): boolean {
    const firstBlock = selectedBlocks.first ()
    const prevBlock = contentState.getBlockBefore ( firstBlock.getKey () )
    if ( ! prevBlock ) return false
    return firstBlock.getDepth () <= prevBlock.getDepth ()
}

function adjustDepth ( block: ContentBlock, adjust: number, maxDepth: number ): ContentBlock {
    const currentDepth = block.getDepth ()
    const adjustedDepth = clamp ( currentDepth + adjust, 0, maxDepth )
    return block.set ( 'depth', adjustedDepth ) as ContentBlock
}
