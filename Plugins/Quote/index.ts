import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { Map } from 'immutable'
import { QuoteIcon } from './icons'


export default function createQuotePlugin (): EditorPlugin {
    return {
        id: 'quote',

        plusActions: [
            { action: 'blockquote', Icon: QuoteIcon, returnBreakout: true }
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
