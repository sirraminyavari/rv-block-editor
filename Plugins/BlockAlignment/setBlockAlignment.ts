import { EditorState } from 'draft-js'
import _ from 'lodash'

import { Alignment } from 'BlockEditor'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import setBlockData from 'BlockEditor/Lib/setBlockData'


// TODO: Reset alignment
export default function setBlockAlignment (
    align: Alignment,
    editorState: EditorState,
    setEditorState: SetState < EditorState >
) {
    const contentState = editorState.getCurrentContent ()
    const selectionState = editorState.getSelection ()

    const blockKey = selectionState.getAnchorKey ()
    const contentBlock = contentState.getBlockForKey ( blockKey )

    const currentData = contentBlock.getData ()
    const currentAlignment = currentData.get ( '_align' )

    const newEditorState = currentAlignment === align
        ? setBlockData (
            editorState, blockKey,
            _.omit ( currentData.toObject (), [ '_align' ] )
        )
        : mergeBlockData (
            editorState, blockKey,
            { _align: align }
        )
    setEditorState ( newEditorState )
}
