import { EditorState, Modifier, CompositeDecorator } from 'draft-js'
import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import applyPlusActionToSelection from 'BlockEditor/Lib/applyPlusActionToSelection'
import { Map } from 'immutable'
import setBlockData from 'BlockEditor/Lib/setBlockData'
import nestAwareInsertEmptyBlockBelowAndFocus from 'BlockEditor/Lib/nestAwareInsertEmptyBlockBelowAndFocus'

import { TableIcon } from './icons'
import getTableComponent, { TableCell } from './Table'
import tableLib from './lib'
import { isSelectionInsideOneTable } from './lib/isSelectionInsideOneTable'

// export const TABLE_CELL_MARKER = { start: '#', end: '$' }
export const TABLE_CELL_MARKER = {
    // https://invisible-characters.com
    start: '͏', // U+034F: COMBINING GRAPHEME JOINER
    end: '᠎', // U+180E: MONGOLIAN VOWEL SEPARATOR
}

export interface Config {
    plugins: EditorPlugin[]
}

export default function createTablePlugin(config: Config): EditorPlugin {
    return ({ getUiContext }) => ({
        id: 'table',

        initialize() {
            this.TableComponent = getTableComponent({ getUiContext, ...config })
        },

        plusActions: [{ action: 'table', Icon: TableIcon, returnBreakout: false }],

        blockRenderMap: Map({
            table: {
                element: withBlockWrapper('div', {
                    // TODO: Styles
                }),
            },
        }) as any,

        blockRendererFn(contentBlock) {
            if (contentBlock.getType() !== 'table') return
            return {
                component: this.TableComponent,
                props: tableLib.getTableData(contentBlock),
            }
        },

        keyBindingFn(event, { getEditorState }) {
            if (event.ctrlKey)
                return {
                    KeyQ: 'table-create',
                }[event.code]
            const editorState = getEditorState()
            if (!isSelectionInsideOneTable(editorState)) return
            return {
                Enter: 'enter',
            }[event.code]
        },

        handleKeyCommand(command, _, _2, { getEditorState, setEditorState }) {
            const editorState = getEditorState()
            const fn = {
                'table-create'() {
                    setEditorState(createTable(editorState))
                },
                enter() {
                    const tableBlock = editorState
                        .getCurrentContent()
                        .getBlockForKey(editorState.getSelection().getAnchorKey())
                    const { newEditorState } = nestAwareInsertEmptyBlockBelowAndFocus(editorState, tableBlock)
                    setEditorState(newEditorState)
                },
            }[command]
            fn?.()
            return fn ? 'handled' : 'not-handled'
        },

        decorators: [
            new CompositeDecorator([
                {
                    strategy(contentBlock, cb) {
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

    const newContentState = Modifier.insertText(
        contentState,
        selectionState.merge({ anchorOffset: 0, focusOffset: 0 }), // TODO: new SelectionState
        `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`.repeat(rowN * colN)
    )

    return EditorState.push(editorState, newContentState, 'change-block-type')
}
