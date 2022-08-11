import { EditorState, ContentState, BlockMap } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'

import blsAwareGetBlockRange from '../Lib/blsAwareGetBlockRange'

/**
 * Proviedes block-nesting functionality for the entire editor.
 */
export default function createNestingPlugin(): EditorPlugin {
    return {
        id: '__internal__nesting',

        keyBindingFn(event) {
            if (!event.ctrlKey) return
            return { BracketRight: 'indent-blocks', BracketLeft: 'outdent-blocks' }[event.code]
        },

        handleKeyCommand(command, _, _2, { getEditorState, setEditorState }) {
            if (command !== 'indent-blocks' && command !== 'outdent-blocks') return 'not-handled'

            const editorState = getEditorState()
            const contentState = editorState.getCurrentContent()
            const blockMap = contentState.getBlockMap()
            const selectionState = editorState.getSelection()

            const selectedBlocks = blsAwareGetBlockRange(
                blockMap,
                selectionState.getStartKey(),
                selectionState.getEndKey()
            )
            const adjust = { 'indent-blocks': 1, 'outdent-blocks': -1 }[command]

            if (!validateNesting(contentState, selectedBlocks, adjust)) return 'not-handled'

            const newBlocks = selectedBlocks.map(block => block.set('depth', block.getDepth() + adjust))
            const newBlockMap = contentState.getBlockMap().merge(newBlocks as any)
            const newContentState = contentState.merge({
                blockMap: newBlockMap,
            }) as ContentState

            const newEditorState = EditorState.push(editorState, newContentState, 'adjust-depth')
            setEditorState(newEditorState)
            return 'handled'
        },
    }
}

function validateNesting(contentState: ContentState, selectedBlocks: BlockMap, adjust: number): boolean {
    const firstBlock = selectedBlocks.first()
    const firstBlockDepth = firstBlock.getDepth()
    if (adjust === -1) {
        if (firstBlockDepth <= 0) return false
        return true
    }

    const prevBlock = contentState.getBlockBefore(firstBlock.getKey())
    if (!prevBlock) return false
    return firstBlockDepth <= prevBlock.getDepth()
}
