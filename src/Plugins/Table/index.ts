import { EditorState, Modifier, CompositeDecorator } from 'draft-js'
import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import _ from 'lodash'
import { Map } from 'immutable'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import nestAwareInsertEmptyBlockBelowAndFocus from 'BlockEditor/Lib/nestAwareInsertEmptyBlockBelowAndFocus'

import { TableIcon } from './icons'
import getTableComponent, { TableCell } from './Table'
import tableLib from './lib'

export const TABLE_CELL_MARKER = {
    // https://invisible-characters.com
    start: '͏', // U+034F: COMBINING GRAPHEME JOINER
    end: '᠎', // U+180E: MONGOLIAN VOWEL SEPARATOR
}

export interface Config {
    rowN?: number
    colN?: number
}

export default function createTablePlugin(config: Config = {}): EditorPlugin {
    const { rowN = 4, colN = 3 } = config
    return ({ getUiContext }) => ({
        id: 'table',

        initialize() {
            this.TableComponent = getTableComponent({ getUiContext, ...config })
        },

        plusActions: [
            {
                action: 'table',
                Icon: TableIcon,
                returnBreakout: false,
                stateTransformer(editorState) {
                    const selectionState = editorState.getSelection()
                    const newContentState = _.chain(editorState.getCurrentContent())
                        .thru(contentState =>
                            mergeBlockData(EditorState.createWithContent(contentState), selectionState.getAnchorKey(), {
                                rowN,
                                colN,
                            }).getCurrentContent()
                        )
                        .thru(contentState =>
                            Modifier.insertText(
                                contentState,
                                editorState.getSelection().merge({ anchorOffset: 0, focusOffset: 0 }),
                                `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`.repeat(rowN * colN)
                            )
                        )
                        .value()
                    return EditorState.forceSelection(
                        EditorState.set(editorState, { currentContent: newContentState }),
                        selectionState.merge({ anchorOffset: 1, focusOffset: 1 })
                    )
                },
            },
        ],

        stateTransformer(editorState) {
            return tableLib.adjustSelection(editorState)
        },

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
            if (!tableLib.isSelectionInsideOneTable(editorState).isSelectionInsideOneTable) return
            const freeAction = {
                Enter: 'table-enter',
                ArrowRight: 'table-selection-move-forward',
                ArrowLeft: 'table-selection-move-backward',
            }[event.code]
            if (freeAction) return freeAction
            if (!editorState.getSelection().isCollapsed()) {
                if (event.code === 'Backspace') return 'table-remove-range-backward'
                if (event.code === 'Delete') return 'table-remove-range-forward'
                return 'table-ignore'
            }
        },

        // TODO: Refactor to another file
        handleKeyCommand(command, _1, _2, { getEditorState, setEditorState }) {
            const fn = {
                'table-enter'({ editorState, tableBlock }: typeof args) {
                    const { newEditorState } = nestAwareInsertEmptyBlockBelowAndFocus(editorState, tableBlock)
                    setEditorState(newEditorState)
                    return 'handled'
                },
                'table-selection-move-forward'({ editorState, selectionState, text }: typeof args) {
                    const aOffset = selectionState.getAnchorOffset()

                    if (aOffset >= text.length - 1) {
                        // TODO: Go next block if exist if no go nowhere
                        const nextBlock = editorState.getCurrentContent().getBlockAfter(selectionState.getAnchorKey())
                        if (!nextBlock) return 'handled'
                        const nextBlockKey = nextBlock.getKey()
                        setEditorState(
                            EditorState.forceSelection(
                                editorState,
                                selectionState.merge({
                                    anchorKey: nextBlockKey,
                                    focusKey: nextBlockKey,
                                    anchorOffset: 0,
                                    focusOffset: 0,
                                })
                            )
                        )
                        return 'handled'
                    }

                    const newOffset = aOffset + (text[aOffset] === TABLE_CELL_MARKER.end ? 2 : 1)
                    setEditorState(
                        EditorState.forceSelection(
                            editorState,
                            selectionState.merge({ anchorOffset: newOffset, focusOffset: newOffset })
                        )
                    )
                    return 'handled'
                },
                'table-selection-move-backward'({ editorState, selectionState, text }: typeof args) {
                    const aOffset = selectionState.getAnchorOffset()

                    if (aOffset <= 1) {
                        // TODO: Go next block if exist if no go nowhere
                        const prevBlock = editorState.getCurrentContent().getBlockBefore(selectionState.getAnchorKey())
                        if (!prevBlock) return 'handled'
                        const prevBlockKey = prevBlock.getKey()
                        const length = prevBlock.getLength()
                        setEditorState(
                            EditorState.forceSelection(
                                editorState,
                                selectionState.merge({
                                    anchorKey: prevBlockKey,
                                    focusKey: prevBlockKey,
                                    anchorOffset: length,
                                    focusOffset: length,
                                })
                            )
                        )
                        return 'handled'
                    }

                    const newOffset = aOffset - (text[aOffset - 1] === TABLE_CELL_MARKER.start ? 2 : 1)
                    setEditorState(
                        EditorState.forceSelection(
                            editorState,
                            selectionState.merge({ anchorOffset: newOffset, focusOffset: newOffset })
                        )
                    )
                    return 'handled'
                },
                'table-remove-range-forward'({ editorState, selectionState, contentState }: typeof args) {
                    setEditorState(
                        EditorState.push(
                            editorState,
                            tableLib.removeRange(contentState, selectionState, 'forward'),
                            'remove-range'
                        )
                    )
                    return 'handled'
                },
                'table-remove-range-backward'({ editorState, selectionState, contentState }: typeof args) {
                    setEditorState(
                        EditorState.push(
                            editorState,
                            tableLib.removeRange(contentState, selectionState, 'backward'),
                            'remove-range'
                        )
                    )
                    return 'handled'
                },
                'table-ignore': () => 'handled',
            }[command]
            if (!fn) return 'not-handled'

            const editorState = getEditorState()
            const selectionState = editorState.getSelection()
            const contentState = editorState.getCurrentContent()
            const tableBlock = contentState.getBlockForKey(editorState.getSelection().getAnchorKey())
            const text = tableBlock.getText()
            const args = { editorState, contentState, selectionState, tableBlock, text } as const
            return fn(args) as any
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
