import { EditorPlugin } from 'BlockEditor'


export default function createParagraphPlugin (): EditorPlugin {
    return {
        plusActions: [
            { label: 'Paragraph', action: 'unstyled' }
        ]
    }
}
