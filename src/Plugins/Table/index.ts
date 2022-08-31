import { EditorState, Modifier, CompositeDecorator } from 'draft-js'
import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import applyPlusActionToSelection from 'BlockEditor/Lib/applyPlusActionToSelection'
import { Map } from 'immutable'
import setBlockData from 'BlockEditor/Lib/setBlockData'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'

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

        blockRendererFn(contentBlock) {
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
            if (event.ctrlKey)
                return {
                    KeyQ: 'table-create',
                    KeyE: 'add-row',
                    KeyM: 'add-col',
                }[event.code]
        },

        handleKeyCommand(command, _, _2, { getEditorState, setEditorState }) {
            const editorState = getEditorState()
            const fn = {
                'table-create'() {
                    setEditorState(createTable(editorState))
                },
                'add-row'() {
                    setEditorState(addRow(editorState))
                },
                'add-col'() {},
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

function addRow(editorState: EditorState): EditorState {
    const contentState = editorState.getCurrentContent()
    const selectionState = editorState.getSelection()

    const anchorOffset = selectionState.getAnchorOffset()
    const block = contentState.getBlockForKey(selectionState.getAnchorKey())
    const text = block.getText()

    const rowN = block.getData().get('rowN') as number
    const colN = block.getData().get('colN') as number
    // a -> anchor
    const aCell = text.slice(0, anchorOffset).split(TABLE_CELL_MARKER.end).length - 1
    const aRow = Math.floor(aCell / colN)
    const aCol = aCell % colN

    const eoRowOffset = (() => {
        const skips = (aRow + 1) * colN
        const segments = text.split(TABLE_CELL_MARKER.end)
        const before = segments.slice(0, skips)
        const beforeLen = before.map(s => s.length).reduce((a, v) => a + v, 0)
        return beforeLen + skips
    })()

    const newContentState = Modifier.insertText(
        contentState,
        selectionState.merge({ anchorOffset: eoRowOffset, focusOffset: eoRowOffset }), // TODO: new SelectionState
        `${TABLE_CELL_MARKER.start}${TABLE_CELL_MARKER.end}`.repeat(colN)
    )
    const newEditorState = EditorState.set(mergeBlockData(editorState, block.getKey(), { rowN: rowN + 1, colN }), {
        currentContent: newContentState,
        lastChangeType: 'change-block-data',
    })

    return newEditorState
}
