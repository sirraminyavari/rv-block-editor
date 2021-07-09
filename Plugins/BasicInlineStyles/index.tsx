import { EditorPlugin } from 'BlockEditor'
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon } from './icons'


export default function createBasicInlineStylesPlugin (): EditorPlugin {
    return {
        id: 'basic-inline-styles',

        inlineStyles: [
            { label: 'B', Icon: BoldIcon, style: 'BOLD' },
            { label: 'I', Icon: ItalicIcon, style: 'ITALIC' },
            { label: 'U', Icon: UnderlineIcon, style: 'UNDERLINE' },
            { label: 'S', Icon: StrikethroughIcon, style: 'STRIKETHROUGH' }
        ]
    }
}
