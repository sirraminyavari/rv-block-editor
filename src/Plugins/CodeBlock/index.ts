import { EditorState, RichUtils } from 'draft-js'
import { Map } from 'immutable'

import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-jsx.min'
import 'prismjs/components/prism-typescript.min'
import 'prismjs/components/prism-tsx.min'

import CodeUtils, { onTab } from 'draft-js-code'
import createPrismPlugin from 'draft-js-prism-plugin'

import { EditorPlugin, withBlockWrapper } from '../../BlockEditor'
import mergeBlockData from '../../BlockEditor/Lib/mergeBlockData'

import getCodeBlockComponent from './CodeBlock'
import { CodeBlockIcon } from './icons'

export const supportedLanguages = [
    { name: 'Plain Text', value: 'plaintext' },
    { name: 'HTML', value: 'html' },
    { name: 'CSS', value: 'css' },
    { name: 'JavaScript', value: 'javascript' },
    { name: 'JSX', value: 'jsx' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'TSX', value: 'tsx' },
    { name: 'C-Like', value: 'clike' },
    { name: 'XML', value: 'xml' },
    { name: 'SVG', value: 'svg' },
    { name: 'MathML', value: 'mathhml' },
]

export default function createCodeBlockPlugin(config: any = {}): EditorPlugin {
    return ({ getUiContext }) => ({
        id: 'code-block',

        initialize() {
            this.CodeBlockComponent = getCodeBlockComponent(config)
        },

        handleKeyCommand(command, _, _2, { getEditorState, setEditorState }) {
            const editorState = getEditorState()
            const newState = CodeUtils.hasSelectionInBlock(editorState)
                ? CodeUtils.handleKeyCommand(editorState, command)
                : RichUtils.handleKeyCommand(editorState, command)
            if (newState) setEditorState(newState)
            return newState ? 'handled' : 'not-handled'
        },

        keyBindingFn(event, { getEditorState, setEditorState }) {
            const editorState = getEditorState()
            if (!CodeUtils.hasSelectionInBlock(editorState)) return
            if (event.code === 'Tab') setEditorState(onTab(event, editorState))
            return CodeUtils.getKeyBinding(event)
        },

        handleReturn(event, _, { getEditorState, setEditorState }) {
            const editorState = getEditorState()
            const newState = CodeUtils.hasSelectionInBlock(editorState)
                ? CodeUtils.handleReturn(event, editorState)
                : null
            if (newState) setEditorState(newState)
            return newState ? 'handled' : 'not-handled'
        },

        plusActions: [{ action: 'code-block', Icon: CodeBlockIcon }],

        blockRenderMap: Map({
            'code-block': {
                element: withBlockWrapper('div', {
                    styles: {
                        wrapper: ['pre-wrapper'],
                        contentWrapper: ['pre-content-wrapper'],
                    },
                }),
            },
        }) as any,

        blockRendererFn(contentBlock, { getEditorState, setEditorState }) {
            if (contentBlock.getType() !== 'code-block') return
            return {
                component: this.CodeBlockComponent,
                props: {
                    language: contentBlock.getData().get('language'),
                    setLanguage(language: string) {
                        getUiContext().editorRef.current.focus() // This is necessary to prevent a bug in Firefox
                        const editorState = getEditorState()
                        const newEditorState = mergeBlockData(editorState, contentBlock.getKey(), { language })
                        setEditorState(newEditorState)
                    },
                },
            }
        },

        ...createPrismPlugin({
            // It only has decorators
            prism: Prism,
        }),
    })
}
