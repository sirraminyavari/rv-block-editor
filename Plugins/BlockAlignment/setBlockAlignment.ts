import { EditorState } from 'draft-js'

import { Alignment } from 'BlockEditor'
import mergeBlockDataByKey from 'BlockEditor/Lib/mergeBlockDataByKey'


// TODO: Reset alignment
export default function setBlockAlignment (
    align: Alignment,
    editorState: EditorState,
    setEditorState: SetState < EditorState >
) {
    const selectionState = editorState.getSelection ()
    const blockKey = selectionState.getAnchorKey ()
    const newEditorState = mergeBlockDataByKey (
        editorState,
        blockKey,
        { _align: align }
    )
    setEditorState ( newEditorState )
}
