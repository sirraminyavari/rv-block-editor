import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { RichUtils } from 'draft-js'
import CodeUtils, { onTab } from 'draft-js-code'
import { Map } from 'immutable'


export default function createCodeBlockPlugin (): EditorPlugin {
    return {
        handleKeyCommand ( command, editorState, _, { setEditorState } ) {
            const newState = CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.handleKeyCommand ( editorState, command )
                : RichUtils.handleKeyCommand ( editorState, command )
            if ( newState ) setEditorState ( newState )
            return newState ? 'handled' : 'not-handled'
        },

        keyBindingFn ( event, { getEditorState, setEditorState } ) {
            const editorState = getEditorState ()
            if ( ! CodeUtils.hasSelectionInBlock ( editorState ) )
                return
            if ( event.key === 'Tab' )
                setEditorState ( onTab ( event, editorState ) )
            return CodeUtils.getKeyBinding ( event )
        },

        handleReturn ( event, editorState, { setEditorState } ) {
            const newState = CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.handleReturn ( event, editorState )
                : null
            if ( newState ) setEditorState ( newState )
            return newState ? 'handled' : 'not-handled'
        },

        plusActions: [
            { label: 'Code Block', action: 'code-block' }
        ],

        blockRenderMap: Map ({
            'code-block': {
                element: withBlockWrapper ( 'pre' ),
                wrapper: <pre className = { 'public/DraftStyleDefault/pre' } />
            }
        }) as any
    }
}
