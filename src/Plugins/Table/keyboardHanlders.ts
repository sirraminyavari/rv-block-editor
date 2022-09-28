import { ContentBlock, ContentState, EditorState, SelectionState } from 'draft-js'
import nestAwareInsertEmptyBlockBelowAndFocus from 'BlockEditor/Lib/nestAwareInsertEmptyBlockBelowAndFocus'
import { EditorPluginObject } from 'BlockEditor'

import { TABLE_CELL_MARKER } from '.'
import tableLib from './lib'

export const keyBindingFn: EditorPluginObject['keyBindingFn'] = (event, { getEditorState, setEditorState }) => {
    const editorState = getEditorState()
    const selectionStatus = tableLib.isSelectionInsideOneTable(editorState)
    if (!selectionStatus.isSelectionInsideOneTable) return
    if (event.code === 'Enter') return 'table-error'
    if (['ArrowRight', 'ArrowLeft'].indexOf(event.code) >= 0)
        return (
            void console.log(event.ctrlKey, event.shiftKey) ||
            tableLib.tableSelectionMoveForward(
                editorState,
                setEditorState,
                selectionStatus.selection,
                selectionStatus.tableBlock.getText(),
                event.ctrlKey,
                event.shiftKey
            )
        )
    if (!editorState.getSelection().isCollapsed()) {
        if (event.code === 'Backspace') return 'table-remove-range-backward'
        if (event.code === 'Delete') return 'table-remove-range-forward'
        return 'table-ignore'
    }
}

type handler = (args: {
    editorState: EditorState
    setEditorState: SetState<EditorState>
    contentState: ContentState
    selectionState: SelectionState
    tableBlock: ContentBlock
    text: string
}) => 'handled' | 'not-handled'

const handlers: Record<string, handler> = {
    'table-enter'({ editorState, setEditorState, tableBlock }) {
        const { newEditorState } = nestAwareInsertEmptyBlockBelowAndFocus(editorState, tableBlock)
        setEditorState(newEditorState)
        return 'handled'
    },
    'table-selection-move-forward'({ editorState, setEditorState, selectionState, text }) {
        tableLib.tableSelectionMoveForward(editorState, setEditorState, selectionState, text)
        return 'handled'
    },
    'table-selection-move-backward'({ editorState, setEditorState, selectionState, text }) {
        const aOffset = selectionState.getAnchorOffset()

        if (aOffset <= 1) {
            const prevBlock = editorState.getCurrentContent().getBlockBefore(selectionState.getAnchorKey())
            if (!prevBlock) return 'handled'
            const prevBlockKey = prevBlock.getKey()
            const length = prevBlock.getLength()
            setEditorState(
                EditorState.forceSelection(
                    editorState,
                    selectionState.merge({
                        anchorKey: prevBlockKey,
                        focusKey: prevBlockKey,
                        anchorOffset: length,
                        focusOffset: length,
                    })
                )
            )
            return 'handled'
        }

        const newOffset = aOffset - (text[aOffset - 1] === TABLE_CELL_MARKER.start ? 2 : 1)
        setEditorState(
            EditorState.forceSelection(
                editorState,
                selectionState.merge({ anchorOffset: newOffset, focusOffset: newOffset })
            )
        )
        return 'handled'
    },
    'table-remove-range-forward'({ editorState, setEditorState, selectionState, contentState }) {
        setEditorState(
            EditorState.push(editorState, tableLib.removeRange(contentState, selectionState, 'forward'), 'remove-range')
        )
        return 'handled'
    },
    'table-remove-range-backward'({ editorState, setEditorState, selectionState, contentState }) {
        setEditorState(
            EditorState.push(
                editorState,
                tableLib.removeRange(contentState, selectionState, 'backward'),
                'remove-range'
            )
        )
        return 'handled'
    },
    'table-ignore': () => 'handled',
}

export const handleKeyCommand: EditorPluginObject['handleKeyCommand'] = (
    command,
    _1,
    _2,
    { getEditorState, setEditorState }
) => {
    const handler = handlers[command]
    if (!handler) return 'not-handled'

    const editorState = getEditorState()
    const selectionState = editorState.getSelection()
    const contentState = editorState.getCurrentContent()
    const tableBlock = contentState.getBlockForKey(editorState.getSelection().getAnchorKey())
    const text = tableBlock.getText()
    const args = { editorState, setEditorState, contentState, selectionState, tableBlock, text }
    return handler(args)
}
