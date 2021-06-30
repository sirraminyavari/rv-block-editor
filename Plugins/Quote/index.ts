import { EditorPlugin } from 'BlockEditor'


export default function createQuotePlugin (): EditorPlugin {
    return {
        plusActions: [
            { label: 'Quote', action: 'blockquote', returnBreakout: true }
        ]
    }
}
