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
    const { inlineStyleMenuInfo: { getSelectionRect, domSelection }, dir } = useUiContext ()
    const [ menuRef, setMenuRef ] = useState < HTMLDivElement > ( null )
    const virtualReference = useMemo ( () => ({ getBoundingClientRect: getSelectionRect }), [ getSelectionRect, domSelection ] )
    const popper = usePopper ( virtualReference, menuRef, { placement: `top-${ { ltr: 'start', rtl: 'end' } [ dir ] }` as any } )
    const activeInlineStyles = getSelectionInlineStyle ( editorState )
    return <div
        className = { styles.inlineStyleMenu }
        ref = { setMenuRef }
        style = { popper.styles.popper }
        { ...popper.attributes.popper }
    >
        <Overlay
            className = { styles.overlay }
            style = {{
                transform: `translateY( calc( ${ popper.styles.popper.top === '0' ? 1 : -1 } * .3rem ) )`
            }}
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
    </div>
}
