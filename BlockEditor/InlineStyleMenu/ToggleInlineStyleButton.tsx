import { FC } from 'react'
import { RichUtils } from 'draft-js'

import { TransformedInlineStyle } from 'BlockEditor'
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
        Icon = { Icon }
        active = { active }
        onClick = { () => {
            const newEditorState = RichUtils.toggleInlineStyle ( editorState, style )
            setEditorState ( newEditorState )
        } }
    />
}
export default ToggleInlineStyleButton
