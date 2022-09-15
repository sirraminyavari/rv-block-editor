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
            const editorState = getEditorState()
            if (!isSelectionInsideOneTable(editorState).isSelectionInsideOneTable) return
            return {
                Enter: 'enter',
                ArrowRight: 'selection-move-right',
            }[event.code]
        },

        handleKeyCommand(command, _, _2, { getEditorState, setEditorState }) {
            const fn = {
                enter() {
                    const editorState = getEditorState()
                    const tableBlock = editorState
                        .getCurrentContent()
                        .getBlockForKey(editorState.getSelection().getAnchorKey())
                    const { newEditorState } = nestAwareInsertEmptyBlockBelowAndFocus(editorState, tableBlock)
                    setEditorState(newEditorState)
                },
                'selection-move-right'() {
                    console.log('arrow-right')
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
