import { EditorState, Modifier, CompositeDecorator } from 'draft-js'
import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import _ from 'lodash'
import { Map } from 'immutable'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'

import { TableIcon } from './icons'
import getTableComponent, { TableCell } from './Table'
import tableLib from './lib'
import * as keyboardHanlders from './keyboardHanlders'

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

        ...keyboardHanlders,

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
