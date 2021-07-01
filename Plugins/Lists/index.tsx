import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import cn from 'classnames'
import { Map } from 'immutable'


export default function createListsPlugin ( config: any = {} ): EditorPlugin {
    return {
        plusActions: [
            { label: 'Ordered List', action: 'ordered-list-item', doubleBreakout: true },
            { label: 'Unordered List', action: 'unordered-list-item', doubleBreakout: true }
        ],
        blockRenderMap: Map ({
            'unordered-list-item': {
                element: withBlockWrapper ( 'li' ),
                wrapper: <ul className = { cn ( 'public/DraftStyleDefault/ul', config.styles?.ul ) } />
            },
            'ordered-list-item': {
                element: withBlockWrapper ( 'li' ),
                wrapper: <ol className = { cn ( 'public/DraftStyleDefault/ol', config.styles?.ol ) } />
            }
        }) as any
    }
}
