import { EditorPlugin, TransformedPlusAction } from 'BlockEditor'

import _createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin'


export interface Config {
    plusActions: TransformedPlusAction []
}

/**
 * Provides functionality for breaking out of Block Types on return keypress.
 */
export default function createBlockBreakoutPlugin ( { plusActions }: Config ): EditorPlugin {
    return {
        id: '__internal__block-breakout',

        ..._createBlockBreakoutPlugin ({
            breakoutBlocks: plusActions.filter ( pa => pa.returnBreakout ).map ( pa => pa.action ),
            doubleBreakoutBlocks: plusActions.filter ( pa => pa.doubleBreakout ).map ( pa => pa.action )
        })
    }
}
