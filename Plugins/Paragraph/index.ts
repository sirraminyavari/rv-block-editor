import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { Map } from 'immutable'


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
