import { EditorState } from 'draft-js'
import _ from 'lodash'

import tableLib from './lib'

export default function stateTransformer(
    incomingEditorState: EditorState,
    prevEditorState: EditorState
) {
    return _.chain(incomingEditorState)
        .thru(incomingEditorState => f(incomingEditorState, prevEditorState))
        .thru(incomingEditorState =>
            tableLib.adjustSelection(incomingEditorState, prevEditorState)
        )
        .value()
}

function f(
    incomingEditorState: EditorState,
    prevEditorState: EditorState
): EditorState {
    return incomingEditorState
}
