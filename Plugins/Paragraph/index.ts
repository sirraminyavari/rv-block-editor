import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'


export default function createParagraphPlugin (): EditorPlugin {
    return {
        id: 'paragraph',

        blockRenderMap: Map ({
            unstyled: {
                element: withBlockWrapper ( 'div', { styles: { wrapper: [ 'paragraph' ] } } ),
                aliasedElements: [ 'p' ]
            }
        }) as any
    }
}
