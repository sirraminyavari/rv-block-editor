import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { RichUtils } from 'draft-js'
import CodeUtils, { onTab } from 'draft-js-code'
import cn from 'classnames'
import { Map } from 'immutable'
import { CodeBlockIcon } from './icons'


export default function createCodeBlockPlugin ( config: any = {} ): EditorPlugin {
    return {
        id: 'code-block',

        handleKeyCommand ( command, _, _2, { getEditorState, setEditorState } ) {
            const editorState = getEditorState ()
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

        handleReturn ( event, _, { getEditorState, setEditorState } ) {
            const editorState = getEditorState ()
            const newState = CodeUtils.hasSelectionInBlock ( editorState )
                ? CodeUtils.handleReturn ( event, editorState )
                : null
            if ( newState ) setEditorState ( newState )
            return newState ? 'handled' : 'not-handled'
        },

        plusActions: [
            { action: 'code-block', Icon: CodeBlockIcon }
        ],

        blockRenderMap: Map ({
            'code-block': {
                element: withBlockWrapper ( 'pre', {
                    styles: {
                        wrapper: [ 'pre-wrapper' ],
                        contentWrapper: [ 'pre-content-wrapper' ]
                    }
                } ),
                wrapper: <pre className = { cn ( 'public/DraftStyleDefault/pre', config.styles?.pre ) } />
            }
        }) as any
    }
}
