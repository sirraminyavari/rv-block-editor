import { EditorState } from 'draft-js'
import _ from 'lodash'

import { Alignment } from 'BlockEditor'
import mergeBlockDataByKey from 'BlockEditor/Lib/mergeBlockDataByKey'
import setBlockDataByKey from 'BlockEditor/Lib/setBlockDataByKey'


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
        ? setBlockDataByKey (
            editorState, blockKey,
            _.omit ( currentData.toObject (), [ '_align' ] )
        )
        : mergeBlockDataByKey (
            editorState, blockKey,
            { _align: align }
        )
    setEditorState ( newEditorState )
}
