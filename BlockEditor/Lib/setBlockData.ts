import { EditorState } from 'draft-js'

import { modifyBlockByKey } from 'draft-js-modifiers'


export default function setBlockData (
    editorState: EditorState,
    blockKey: string,
    data: Object
) {
    return EditorState.forceSelection (
        modifyBlockByKey ( editorState, blockKey, { data } ),
        editorState.getSelection ()
    )
}
