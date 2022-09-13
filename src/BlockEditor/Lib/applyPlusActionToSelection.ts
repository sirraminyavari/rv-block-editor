import { EditorState, ContentState, ContentBlock, RichUtils, Modifier } from 'draft-js'
import { getSelectedBlock } from 'draftjs-utils'

// FIXME: Spaghetti dependencies
import _ from 'lodash'
import mergeBlockData from './mergeBlockData'
import { TABLE_CELL_MARKER } from 'Plugins/Table'

/**
 * Toggles the specified Plus Action on the Content Block that the cursor resides on.
 *
 * @param editorState - Current Editor State.
 * @param plusAction - The Plus Action to be toggled.
 *
 * @returns A new Editor State with the specified Plus Action toggled.
 */
export default function applyPlusActionToSelection(editorState: EditorState, plusAction: string): EditorState {
    const selectedBlock = getSelectedBlock(editorState) as ContentBlock
    const selectedBlockKey = selectedBlock.getKey()

    const editorStateAfterPlusAction = RichUtils.toggleBlockType(editorState, plusAction)
    const alteredContentState = editorStateAfterPlusAction.getCurrentContent()
    const alteredSelectedBlock = alteredContentState.getBlockForKey(selectedBlockKey)

    const depthAdjustedSelectedBlock = alteredSelectedBlock.set('depth', selectedBlock.getDepth()) as ContentBlock
    const depthAdjustedContentState = alteredContentState.merge({
        blockMap: alteredContentState.getBlockMap().set(selectedBlockKey, depthAdjustedSelectedBlock),
    }) as ContentState

    // FIXME: Spaghetti code
    const [rowN, colN] = [4, 3]
    const newContentBlock =
        alteredSelectedBlock.getType() !== 'table'
            ? depthAdjustedContentState
            : (() =>
                  _.chain(depthAdjustedContentState)
                      .thru(contentState =>
                          mergeBlockData(EditorState.createWithContent(contentState), selectedBlockKey, {
                              rowN,
                              colN,
                          }).getCurrentContent()
                      )
                      .thru(contentState =>
                          Modifier.insertText(
                              contentState,
                              editorState.getSelection().merge({ anchorOffset: 0, focusOffset: 0 }), // TODO: new SelectionState
                              `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`.repeat(rowN * colN)
                          )
                      )
                      .value())()
    return EditorState.push(editorState, newContentBlock, 'change-block-type')
}
