import { RichUtils } from 'draft-js'
import { Map } from 'immutable'

import CodeUtils, { onTab } from 'draft-js-code'
import Prism from 'prismjs'
import createPrismPlugin from 'draft-js-prism-plugin'
import 'prismjs/themes/prism.css'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import mergeBlockDataByKey from 'BlockEditor/Lib/mergeBlockDataByKey'

import getCodeBlockComponent from './CodeBlock'
import { CodeBlockIcon } from './icons'


export default function createCodeBlockPlugin ( config: any = {} ): EditorPlugin {
    return {
        id: 'code-block',

        initialize () {
            this.CodeBlockComponent = getCodeBlockComponent ( config )
        },

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
                element: withBlockWrapper ( 'div', {
                    styles: {
                        wrapper: [ 'pre-wrapper' ],
                        contentWrapper: [ 'pre-content-wrapper' ]
                    }
                } )
            }
        }) as any,

        blockRendererFn ( contentBlock, { getEditorState, setEditorState } ) {
            if ( contentBlock.getType () !== 'code-block' ) return
            return {
                component: this.CodeBlockComponent,
                props: {
                    prism: Prism,
                    language: contentBlock.getData ().get ( 'language' ),
                    setLanguage ( language: string ) {
                        const editorState = getEditorState ()
                        const newEditorState = mergeBlockDataByKey ( editorState, contentBlock.getKey (), { language } )
                        setEditorState ( newEditorState )
                    }
                }
            }
        },

        ...createPrismPlugin ({ // It only has decorators
            prism: Prism
        })
    }
}
