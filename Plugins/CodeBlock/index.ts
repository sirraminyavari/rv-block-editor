import { EditorPlugin } from 'BlockEditor'
import { RichUtils, getDefaultKeyBinding } from 'draft-js'
import CodeUtils from 'draft-js-code'


export default function createCodeBlockPlugin (): EditorPlugin {
    function onTab ( event, { getEditorState, setEditorState } ) {
        const editorState = getEditorState ()
        const newState = CodeUtils.hasSelectionInBlock ( editorState )
            ? CodeUtils.onTab ( event, editorState )
            : null
        if ( newState ) {
            setEditorState ( newState )
            return true
        }
    }

    return {
        handleKeyCommand ( command, editorState, _, { setEditorState } ) {
            const newState = CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.handleKeyCommand ( editorState, command )
                : RichUtils.handleKeyCommand ( editorState, command )
            if ( newState ) setEditorState ( newState )
            return newState ? 'handled' : 'not-handled'
        },

        keyBindingFn ( event, pluginFunctions ) {
            if ( event.key === 'Tab' )
                return onTab ( event, pluginFunctions )
            const editorState = pluginFunctions.getEditorState ()
            return CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.getKeyBinding ( event ) || getDefaultKeyBinding ( event )
                : getDefaultKeyBinding ( event )
        },

        handleReturn ( event, editorState, { setEditorState } ) {
            const newState = CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.handleReturn ( event, editorState )
                : null
            if ( newState ) setEditorState ( newState )
            return newState ? 'handled' : 'not-handled'
        },

        plusActions: [
            { label: 'Code Block', action: 'code-block' },
        ]
    }
}
