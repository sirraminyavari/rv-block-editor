import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { Map } from 'immutable'


export default function createQuotePlugin (): EditorPlugin {
    return {
        plusActions: [
            { label: 'Quote', action: 'blockquote', returnBreakout: true }
        ],
        blockRenderMap: Map ({
            blockquote: {
                element: withBlockWrapper ( 'blockquote', {
                    styles: {
                        wrapper: [ 'quote-wrapper' ],
                        contentWrapper: [ 'quote-content-wrapper' ]
                    }
                } )
            }
        }) as any
    }
}
