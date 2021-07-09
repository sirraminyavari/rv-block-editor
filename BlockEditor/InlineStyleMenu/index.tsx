import { FC, useState, useMemo } from 'react'
import { RichUtils } from 'draft-js'
import { getSelectionInlineStyle } from 'draftjs-utils'
import Overlay from 'BlockEditor/Ui/Overlay'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import useTransformedPluginsContext from 'BlockEditor/Contexts/TransformedPlugins'
import { usePopper } from 'react-popper'
import Button from 'BlockEditor/Ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

import styles from './styles.module.scss'


const InlineStyleMenu: FC = () => {
    return <AnimatePresence children = { useUiContext ().inlineStyleMenuInfo.isOpen && <Menu /> } />
}
export default InlineStyleMenu

function Menu () {
    const { editorState, setEditorState } = useEditorContext ()
    const { inlineStyleMenuInfo: { getSelectionRect, domSelection }, dir } = useUiContext ()
    const { inlineStyles } = useTransformedPluginsContext ()
    const [ menuRef, setMenuRef ] = useState < HTMLDivElement > ( null )
    const virtualReference = useMemo ( () => ({
        getBoundingClientRect: () => getSelectionRect () || new DOMRect ()
    }), [ getSelectionRect, domSelection ] )
    const popper = usePopper ( virtualReference, menuRef, { placement: `top-${ { ltr: 'start', rtl: 'end' } [ dir ] }` as any } )
    const activeInlineStyles = getSelectionInlineStyle ( editorState )
    return <motion.div
        initial = 'initial' animate = 'animate' exit = 'exit'
        variants = {{ initial: {}, animate: {}, exit: {} }}
        transition = {{ staggerChildren: .02 }}
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
                variants = {{
                    initial: { opacity: 0, scale: .4 },
                    animate: { opacity: 1, scale: 1 },
                }}
                Icon = { Icon }
                active = { activeInlineStyles [ style ] }
                onClick = { () => {
                    const newEditorState = RichUtils.toggleInlineStyle ( editorState, style )
                    setEditorState ( newEditorState )
                } }
            /> ) }
        </Overlay>
    </motion.div>
}
