import { EditorPlugin } from 'BlockEditor'


export default function createListsPlugin (): EditorPlugin {
    return {
        plusActions: [
            { label: 'Ordered List', action: 'ordered-list-item' },
            { label: 'Unordered List', action: 'unordered-list-item' }
        ]
    }
}
