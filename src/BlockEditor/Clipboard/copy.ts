import { ContentState, convertToRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import { ClipboardEventHandler, ClipboardData } from '.'

import getBlockRange from '../Lib/getBlockRange'

/**
 * Copies the selected content into the clipboard while taking block-level selection
 * into account.
 * This function trys to be as versitile as possible and copies HTML and JSON data in
 * a way that is perfectly reversable in the editor while also supporting other text
 * based softwares such as Microsoft Word.
 */
const copyHandler: ClipboardEventHandler = (editor, getUiState, _, event) => {
    const { getEditorState } = editor
    const editorState = getEditorState()
    const { blockLevelSelectionInfo } = getUiState()

    if (!blockLevelSelectionInfo.enabled) return
    event.preventDefault()

    const contentState = editorState.getCurrentContent()
    const blockMap = contentState.getBlockMap()
    const { selectedBlockKeys } = blockLevelSelectionInfo
    const selectedBlockMap = getBlockRange(
        blockMap,
        selectedBlockKeys[0],
        selectedBlockKeys[selectedBlockKeys.length - 1]
    )

    const copiedContentState = ContentState.createFromBlockArray(
        selectedBlockMap.toArray()
    )
    const rawContent = convertToRaw(copiedContentState)

    const data: ClipboardData = {
        NEXTLE_blockEditor: true,
        NEXTLE_blockEditor_BLS: true,
        NEXTLE_blockEditor_version: 1,
        rawContent,
    }

    event.clipboardData.setData('text/plain', copiedContentState.getPlainText())
    event.clipboardData.setData('text/html', toHtml(copiedContentState))
    event.clipboardData.setData('application/json', JSON.stringify(data))
}
export default copyHandler

function toHtml(contentState: ContentState): string {
    const htmlStr = stateToHTML(contentState)
    const elem = document.createElement('div')
    elem.innerHTML = htmlStr
    elem.setAttribute('data-NEXTLE_blockEditor', 'true')
    elem.setAttribute('data-NEXTLE_blockEditor_BLS', 'true')
    elem.setAttribute('data-NEXTLE_blockEditor_version', '1')
    return elem.outerHTML
}
