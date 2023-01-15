// TODO: Docs
import {
    ContentBlock,
    ContentState,
    EditorState,
    SelectionState,
} from 'draft-js'
import nestAwareInsertEmptyBlockBelowAndFocus from 'BlockEditor/Lib/nestAwareInsertEmptyBlockBelowAndFocus'
import { EditorPluginObject } from 'BlockEditor'

import tableLib from './lib'

export const keyBindingFn: EditorPluginObject['keyBindingFn'] = (
    event,
    { getEditorState }
) => {
    const editorState = getEditorState()
    const selectionStatus = tableLib.isSelectionInsideOneTable(editorState)
    if (!selectionStatus.isSelectionInsideOneTable) return
    if (event.code === 'Enter') return 'table-enter'
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
        const { newEditorState } = nestAwareInsertEmptyBlockBelowAndFocus(
            editorState,
            tableBlock
        )
        setEditorState(newEditorState)
        return 'handled'
    },
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
    const tableBlock = contentState.getBlockForKey(
        editorState.getSelection().getAnchorKey()
    )
    const text = tableBlock.getText()
    const args = {
        editorState,
        setEditorState,
        contentState,
        selectionState,
        tableBlock,
        text,
    }
    return handler(args)
}
