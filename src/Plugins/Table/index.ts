import { EditorPlugin } from '../../BlockEditor'

import { TableIcon } from './icons'

export interface Config {}

export default function createTablePlugin(config: Config): EditorPlugin {
    return {
        id: 'table',

        plusActions: [{ action: 'table', Icon: TableIcon, returnBreakout: true }],

        keyBindingFn(event) {
            if (event.ctrlKey && event.code === 'KeyQ') return '__test__' // TODO: Remove!
        },
        handleKeyCommand(command, _, _2, { getEditorState, setEditorState }) {
            const editorState = getEditorState()
            if (command !== '__test__') return 'not-handled'
            console.log('TABLE PLUGIN:', editorState)
            return 'handled'
        },
    }
}
