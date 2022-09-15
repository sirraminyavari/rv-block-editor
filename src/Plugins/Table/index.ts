import { EditorState, Modifier, CompositeDecorator, ContentBlock } from 'draft-js'
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
                ArrowRight: 'selection-move-forward',
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
                    return 'handled'
                },
                'selection-move-forward'() {
                    const editorState = getEditorState()
                    const selectionState = editorState.getSelection()
                    const aOffset = selectionState.getAnchorOffset()
                    const tableBlock = editorState
                        .getCurrentContent()
                        .getBlockForKey(editorState.getSelection().getAnchorKey())
                    const text = tableBlock.getText()

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
            }[command]
            return (fn?.() as any) ?? 'not-handled'
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
