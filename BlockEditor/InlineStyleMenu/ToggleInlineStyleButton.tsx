import { FC } from 'react'
import { RichUtils } from 'draft-js'
import { TransformedInlineStyle } from 'BlockEditor/types'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import Button from 'BlockEditor/Ui/Button'


export interface ToggleInlineStyleButtonProps {
    inlineStyle: TransformedInlineStyle
    active: boolean
}

/**
 * Toggles an Inline Style on the current selection.
 */
const ToggleInlineStyleButton: FC < ToggleInlineStyleButtonProps > = ({
    inlineStyle: { Icon, style }, active
}) => {
    const { editorState, setEditorState } = useEditorContext ()
    return <Button
        variants = {{
            initial: { opacity: 0, scale: .4 },
            animate: { opacity: 1, scale: 1 },
        }}
        Icon = { Icon }
        active = { active }
        onClick = { () => {
            const newEditorState = RichUtils.toggleInlineStyle ( editorState, style )
            setEditorState ( newEditorState )
        } }
    />
}
export default ToggleInlineStyleButton
