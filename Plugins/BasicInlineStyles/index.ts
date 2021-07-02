import { EditorPlugin } from 'BlockEditor'
import { GrBold as BoldIcon, GrUnderline as UnderlineIcon, GrItalic as ItalicIcon, GrStrikeThrough as StrikethroughIcon } from 'react-icons/gr'


export default function createBasicInlineStylesPlugin (): EditorPlugin {
    return {
        inlineStyles: [
            { label: 'B', Icon: BoldIcon, style: 'BOLD' },
            { label: 'I', Icon: ItalicIcon, style: 'ITALIC' },
            { label: 'U', Icon: UnderlineIcon, style: 'UNDERLINE' },
            { label: 'S', Icon: StrikethroughIcon, style: 'STRIKETHROUGH' }
        ]
    }
}
