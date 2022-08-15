import {
    EditorState,
    EditorBlock,
    ContentBlock,
    ContentState,
    BlockMap,
    Modifier,
    SelectionState,
    DraftInlineStyle,
} from 'draft-js'
import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { Map, OrderedSet } from 'immutable'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'

import { TableIcon } from './icons'
import getTableComponent from './Table'

export interface Config {
    plugins: EditorPlugin[]
}

export default function createTablePlugin(config: Config): EditorPlugin {
    return ({ getUiContext }) => ({
        id: 'table',

        initialize() {
            this.TableComponent = getTableComponent({ getUiContext, ...config })
        },

        plusActions: [{ action: 'table', Icon: TableIcon, returnBreakout: true }],

        blockRenderMap: Map({
            table: { element: withBlockWrapper('div', {}) },
        }) as any,

        blockRendererFn(contentBlock, { getEditorState, setEditorState }) {
            if (contentBlock.getType() !== 'table') return
            return {
                component: this.TableComponent,
                props: {
                    subEditorState: contentBlock.getData().get('subEditorState'),
                    setSubEditorState(subEditorState: EditorState, opts?: { replace?: boolean }) {
                        const editorState = getEditorState()
                        const newEditorState = mergeBlockData(editorState, contentBlock.getKey(), { subEditorState })
                        setEditorState(
                            opts?.replace
                                ? newEditorState
                                : EditorState.push(editorState, newEditorState.getCurrentContent(), 'change-block-data')
                        )
                    },
                },
            }
        },

        keyBindingFn(event) {
            if (event.ctrlKey && event.code === 'KeyQ') return '__test__' // TODO: Remove!
        },

        handleKeyCommand(command, _, _2, { getEditorState, setEditorState }) {
            const editorState = getEditorState()
            if (command !== '__test__') return 'not-handled'
            const newState = createTable(editorState)
            setEditorState(newState)
            return 'handled'
        },

        customStyleFn(style, block, pluginFunctions) {
            const cellTag = style.find(v => v.startsWith('table-cell-'))
            if (!cellTag) return {}
            return { border: '1px solid red' }
        },
    })
}

function createTable(editorState: EditorState, rowN = 4, colN = 3): EditorState {
    const selectionState = editorState.getSelection()
    const contentState = editorState.getCurrentContent()

    const newContentState = Array.from({ length: rowN * colN }).reduce((contentState, _, i) => {
        const offset = i * 2
        const row = Math.floor(i / colN)
        const col = i % colN
        return Modifier.insertText(
            contentState as ContentState,
            selectionState.merge({
                anchorOffset: offset,
                focusOffset: offset,
            }),
            `‌‌`, // 2 half-spaces (hidden charaters)
            OrderedSet([`table-cell-${row}-${col}`])
        )
    }, contentState) as ContentState

    console.log(newContentState.toJS())

    return EditorState.push(editorState, newContentState, 'change-block-type')
}
