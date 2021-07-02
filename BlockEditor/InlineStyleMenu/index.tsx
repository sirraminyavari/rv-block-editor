import { FC, useState, useMemo } from 'react'
import { RichUtils } from 'draft-js'
import { getSelectionInlineStyle } from 'draftjs-utils'
import Overlay from 'BlockEditor/Ui/Overlay'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import { usePopper } from 'react-popper'
import Button from 'BlockEditor/Ui/Button'

import styles from './styles.module.scss'


const InlineStyleMenu: FC = () => {
    if ( ! useUiContext ().inlineStyleMenuInfo.isOpen )
        return null
    return <Menu />
}
export default InlineStyleMenu

function Menu () {
    const { editorState, setEditorState, inlineStyles } = useEditorContext ()
    const { inlineStyleMenuInfo: { getSelectionRect } } = useUiContext ()
    const [ menuRef, setMenuRef ] = useState < HTMLDivElement > ( null )
    const virtualReference = useMemo ( () => ({ getBoundingClientRect: getSelectionRect }), [ getSelectionRect ] )
    const popper = usePopper ( virtualReference, menuRef, { placement: 'top' } )
    const activeInlineStyles = getSelectionInlineStyle ( editorState )
    return <Overlay
        ref = { setMenuRef }
        className = { styles.inlineStyleMenu }
        style = { popper.styles.popper }
        { ...popper.attributes.popper }
    >
        { inlineStyles.map ( ({ Icon, style }) => <Button
            key = { style }
            Icon = { Icon }
            active = { activeInlineStyles [ style ] }
            onClick = { () => {
                const newEditorState = RichUtils.toggleInlineStyle ( editorState, style )
                setEditorState ( newEditorState )
            } }
        /> ) }
    </Overlay>
}
