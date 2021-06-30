import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { Map } from 'immutable'


export default function createParagraphPlugin (): EditorPlugin {
    return {
        plusActions: [
            { label: 'Paragraph', action: 'unstyled' }
        ],
        blockRenderMap: Map ({
            unstyled: {
                element: withBlockWrapper ( 'div' ),
                aliasedElements: [ 'p' ]
            }
        }) as any
    }
}
