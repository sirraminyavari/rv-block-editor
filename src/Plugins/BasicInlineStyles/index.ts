import { RichUtils } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon } from './icons'

export default function createBasicInlineStylesPlugin(): EditorPlugin {
    return {
        id: 'basic-inline-styles',

        inlineStyles: [
            { Icon: BoldIcon, style: 'BOLD' },
            { Icon: ItalicIcon, style: 'ITALIC' },
            { Icon: UnderlineIcon, style: 'UNDERLINE' },
            { Icon: StrikethroughIcon, style: 'STRIKETHROUGH' },
        ],

        handleKeyCommand(command, _, _2, { getEditorState, setEditorState }) {
            const editorState = getEditorState()
            const newState = RichUtils.handleKeyCommand(editorState, command)
            if (newState && newState !== editorState) {
                setEditorState(newState)
                return 'handled'
            }
            return 'not-handled'
        },
    }
}
