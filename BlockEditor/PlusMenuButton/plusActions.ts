export interface PlusAction {
    label: string
    action: string
}

const plusActions: PlusAction [] = [
    ...[ 'one', 'two', 'three', 'four', 'five', 'six' ].map ( ( numStr, n ) => ({
        label: `Heading ${ n + 1 }`, action: `header-${ numStr }`
    }) ),
    { label: 'Quote', action: 'blockquote' },
    { label: 'Code Block', action: 'code-block' },
    { label: 'Ordered List', action: 'ordered-list-item' },
    { label: 'Unordered List', action: 'unordered-list-item' },
    { label: 'Paragraph', action: 'unstyled' },
]
export default plusActions
