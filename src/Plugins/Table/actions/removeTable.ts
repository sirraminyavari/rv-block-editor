import { ContentBlock, EditorState, Modifier, SelectionState } from 'draft-js'
import _ from 'lodash'
import { Map } from 'immutable'

export function removeTable(editorState: EditorState, tableBlock: ContentBlock) {
    const contentState = editorState.getCurrentContent()
    const selection = SelectionState.createEmpty(tableBlock.getKey()).merge({
        anchorOffset: 0,
        focusOffset: tableBlock.getLength(),
    })

    const newContentState = _.chain(contentState)
        .thru(contentState => Modifier.setBlockData(contentState, selection, Map({})))
        .thru(contentState => Modifier.setBlockType(contentState, selection, 'unstyled'))
        .thru(contentState => Modifier.removeRange(contentState, selection, 'backward'))
        .value()

    return EditorState.push(editorState, newContentState, 'remove-range')
}
