import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { Map } from 'immutable'


export default function createListsPlugin (): EditorPlugin {
    return {
        plusActions: [
            { label: 'Ordered List', action: 'ordered-list-item', doubleBreakout: true },
            { label: 'Unordered List', action: 'unordered-list-item', doubleBreakout: true }
        ],
        blockRenderMap: Map ({
            'unordered-list-item': {
                element: withBlockWrapper ( 'li' ),
                wrapper: <ul className = { 'public/DraftStyleDefault/ul' } />
            },
            'ordered-list-item': {
                element: withBlockWrapper ( 'li' ),
                wrapper: <ol className = { 'public/DraftStyleDefault/ol' } />
            }
        }) as any
    }
}
