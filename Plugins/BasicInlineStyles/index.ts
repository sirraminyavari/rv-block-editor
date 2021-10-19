import { EditorPlugin } from 'BlockEditor'
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon } from './icons'


export default function createBasicInlineStylesPlugin (): EditorPlugin {
    return {
        id: 'basic-inline-styles',

        inlineStyles: [
            { Icon: BoldIcon, style: 'BOLD' },
            { Icon: ItalicIcon, style: 'ITALIC' },
            { Icon: UnderlineIcon, style: 'UNDERLINE' },
            { Icon: StrikethroughIcon, style: 'STRIKETHROUGH' }
        ]
    }
}
