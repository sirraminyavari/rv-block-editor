import { CompositeDecorator } from 'draft-js'
import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import _ from 'lodash'
import { Map } from 'immutable'

import { TableIcon } from './icons'
import getTableComponent, { getTableCellComponent } from './Table'
import tableLib from './lib'
import * as keyboardHanlders from './keyboardHanlders'
import {
    initialStateTransformer,
    continousStateTransformer,
} from './stateTransformers'

// These markers are used to enclose table cells
export const TABLE_CELL_MARKER = {
    // https://invisible-characters.com
    start: '͏', // U+034F: COMBINING GRAPHEME JOINER
    end: '᠎', // U+180E: MONGOLIAN VOWEL SEPARATOR
    // start: '#',
    // end: '$',
}

export interface Config {
    initialRowN?: number
    initialColN?: number
    styles?: any
}

export default function createTablePlugin(config: Config = {}): EditorPlugin {
    const { initialRowN = 4, initialColN = 3 } = config
    return {
        id: 'table',

        initialize() {
            this.TableComponent = getTableComponent(config)
        },

        plusActions: [
            {
                action: 'table',
                Icon: TableIcon,
                returnBreakout: false,
                initialStateTransformer: initialStateTransformer.bind(
                    initialRowN,
                    initialColN
                ),
            },
        ],

        blockRenderMap: Map({
            table: {
                element: withBlockWrapper('div', {
                    styles: {
                        wrapper: ['table-wrapper'],
                        contentWrapper: ['table-content-wrapper'],
                    },
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
                    component: getTableCellComponent(config),
                },
            ]),
        ],

        ...keyboardHanlders,
        stateTransformer: continousStateTransformer,
    }
}
