import { getDefaultKeyBinding } from 'draft-js'
import CodeUtils from 'draft-js-code'
import { RichUtils } from 'draft-js'


export default function createCodeBlockPlugin () {
    return {
        handleKeyCommand ( command, editorState, _, { setEditorState } ) {
            const newState = CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.handleKeyCommand ( editorState, command )
                : RichUtils.handleKeyCommand ( editorState, command )
            if ( newState ) setEditorState ( newState )
            return newState ? 'handled' : 'not-handled'
        },

        keyBindingFn ( evt, { getEditorState } ) {
            const editorState = getEditorState ()
            return CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.getKeyBinding ( evt ) || getDefaultKeyBinding ( evt )
                : getDefaultKeyBinding ( evt )
        },

        handleReturn ( evt, editorState, { setEditorState } ) {
            const newState = CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.handleReturn ( evt, editorState )
                : null
            if ( newState ) setEditorState ( newState )
            return newState ? 'handled' : 'not-handled'
        },

        onTab ( evt, { getEditorState, setEditorState } ) {
            const editorState = getEditorState ()
            const newState = CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.onTab ( evt, editorState )
                : null
            if ( newState ) setEditorState ( newState )
            return newState ? 'handled' : 'not-handled'
        }
    }
}
