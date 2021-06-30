import { PlusAction } from 'BlockEditor'


const plusActions: PlusAction [] = [
    { label: 'Quote', action: 'blockquote' },
    { label: 'Code Block', action: 'code-block' },
    { label: 'Ordered List', action: 'ordered-list-item' },
    { label: 'Unordered List', action: 'unordered-list-item' },
    { label: 'Paragraph', action: 'unstyled' },
]
export default plusActions
