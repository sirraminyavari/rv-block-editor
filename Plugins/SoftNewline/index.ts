import { EditorPlugin } from 'BlockEditor'

import createSoftNewLinePlugin from '@jimmycode/draft-js-soft-newline-plugin'


export default function createSoftNewlinePlugin (): EditorPlugin {
    return {
        id: 'softnewline',

        ...createSoftNewLinePlugin ()
    }
}
