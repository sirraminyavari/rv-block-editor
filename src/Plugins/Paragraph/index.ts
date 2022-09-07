import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from '../../BlockEditor'

import { ParagraphIcon } from './icons'

export default function createParagraphPlugin(): EditorPlugin {
    return {
        id: 'paragraph',

        plusActions: [{ action: 'unstyled', Icon: ParagraphIcon }],

        blockRenderMap: Map({
            unstyled: {
                element: withBlockWrapper('div', {
                    styles: { wrapper: ['paragraph'] },
                }),
                aliasedElements: ['p'],
            },
        }) as any,
    }
}
