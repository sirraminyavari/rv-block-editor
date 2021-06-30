import { EditorPlugin } from 'BlockEditor'


export default function createListsPlugin (): EditorPlugin {
    return {
        plusActions: [
            { label: 'Ordered List', action: 'ordered-list-item', doubleBreakout: true },
            { label: 'Unordered List', action: 'unordered-list-item', doubleBreakout: true }
        ]
    }
}
