import { EditorState } from 'draft-js'

import { mergeBlockDataByKey as _mergeBlockDataByKey } from 'draft-js-modifiers'


export default function mergeBlockData (
    editorState: EditorState,
    blockKey: string,
    data: Object
) {
    return EditorState.forceSelection (
        _mergeBlockDataByKey ( editorState, blockKey, data ),
        editorState.getSelection ()
    )
}
