import { EditorPlugin } from 'BlockEditor'


export default function BasicInlineStyles (): EditorPlugin {
    return {
        inlineStyles: [
            { label: 'B', style: 'BOLD' },
            { label: 'I', style: 'ITALIC' },
            { label: 'U', style: 'UNDERLINE' },
            { label: 'S', style: 'STRIKETHROUGH' }
        ]
    }
}
