import {
    EditorState,
    EditorBlock,
    ContentBlock,
    ContentState,
    BlockMap,
    Modifier,
    SelectionState,
    DraftInlineStyle,
    CompositeDecorator,
} from 'draft-js'
import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import applyPlusActionToSelection from 'BlockEditor/Lib/applyPlusActionToSelection'
import { Map, OrderedSet } from 'immutable'
import setBlockData from 'BlockEditor/Lib/setBlockData'

import { TableIcon } from './icons'
import getTableComponent, { TableCell } from './Table'

export const TABLE_CELL_MARKER = { start: '#', end: '$' }

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
                    rowN: contentBlock.getData().get('rowN'),
                    colN: contentBlock.getData().get('colN'),
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

        decorators: [
            new CompositeDecorator([
                {
                    strategy(contentBlock, cb, contentState) {
                        if (contentBlock.getType() !== 'table') return
                        const text = contentBlock.getText()
                        let start
                        ;[...text].forEach((char, i) => {
                            switch (char) {
                                case TABLE_CELL_MARKER.start:
                                    start = i
                                    break
                                case TABLE_CELL_MARKER.end:
                                    cb(start, i + 1)
                                    break
                            }
                        })
                    },
                    component: TableCell,
                },
            ]),
        ],
    })
}

function createTable(editorState: EditorState, rowN = 4, colN = 3): EditorState {
    const editorState2 = applyPlusActionToSelection(editorState, 'table')
    const editorState3 = setBlockData(editorState2, editorState2.getSelection().getAnchorKey(), { rowN, colN })

    const selectionState = editorState3.getSelection()
    const contentState = editorState3.getCurrentContent()

    // const newContentState = Array.from({ length: rowN * colN }).reduce((contentState, _, i) => {
    //     const offset = i * 2
    //     const row = Math.floor(i / colN)
    //     const col = i % colN
    //     return Modifier.insertText(
    //         contentState as ContentState,
    //         selectionState.merge({
    //             anchorOffset: offset,
    //             focusOffset: offset,
    //         }),
    //         `${TABLE_CELL_MARK.start}${TABLE_CELL_MARK.end}`,
    //         OrderedSet([`table-cell-${row}-${col}`])
    //     )
    // }, contentState) as ContentState

    const newContentState = Modifier.insertText(
        contentState,
        selectionState.merge({ anchorOffset: 0, focusOffset: 0 }), // TODO: new SelectionState
        `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`.repeat(rowN * colN)
    )

    return EditorState.push(editorState, newContentState, 'change-block-type')
}
