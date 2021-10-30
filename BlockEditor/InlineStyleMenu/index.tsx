import { FC, useState, useMemo } from 'react'
import { getSelectionInlineStyle } from 'draftjs-utils'
import { motion, AnimatePresence } from 'framer-motion'
import { usePopper } from 'react-popper'

import Overlay from 'BlockEditor/Ui/Overlay'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import useTransformedPluginsContext from 'BlockEditor/Contexts/TransformedPlugins'

import ToggleInlineStyleButton from './ToggleInlineStyleButton'

import styles from './styles.module.scss'


/**
 * An overlay menu containing all the Inline Styles.
 * It appears whenever there is a text selection.
 */
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
            children = { inlineStyles.map ( ( inlineStyle, i ) => <motion.div
                key = { i }
                variants = {{
                    initial: { opacity: 0, scale: .4 },
                    animate: { opacity: 1, scale: 1 },
                }}
                children = { inlineStyle.Component
                    ? <inlineStyle.Component
                        editorState = { editorState }
                        setEditorState = { setEditorState }
                    />
                    : <ToggleInlineStyleButton
                        inlineStyle = { inlineStyle }
                        active = { activeInlineStyles [ inlineStyle.style ] }
                    />
                }
            /> ) }
        />
    </motion.div>
}
