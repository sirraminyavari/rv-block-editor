import { EditorState, EditorBlock, ContentBlock, ContentState, BlockMap } from 'draft-js'
import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { Map } from 'immutable'
import { modifyBlockByKey } from 'draft-js-modifiers'
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

        OverlayComponent(props) {
            console.log(props)
            return null
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
    })
}

function createTable(editorState: EditorState, rows = 4, cols = 3): EditorState {
    console.log('TABLE PLUGIN:', editorState)

    const newEditorState = modifyBlockByKey(editorState, editorState.getSelection().getAnchorKey(), {
        text: 'GHOLAM BRO !!',
    })

    console.log(newEditorState.toJS())

    return newEditorState
}
