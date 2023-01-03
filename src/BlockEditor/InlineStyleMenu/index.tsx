import { FC, useState, useMemo } from 'react'
import { getSelectionInlineStyle } from 'draftjs-utils'
import { motion, AnimatePresence } from 'framer-motion'
import { usePopper } from 'react-popper'

import Overlay from '../Ui/Overlay'
import useEditorContext from '../Contexts/EditorContext'
import useUiContext from '../Contexts/UiContext'
import useTransformedPluginsContext from '../Contexts/TransformedPlugins'

import ToggleInlineStyleButton from './ToggleInlineStyleButton'

import * as styles from './styles.module.scss'

/**
 * An overlay menu containing all the Inline Styles.
 * It appears whenever there is a text selection.
 */
const InlineStyleMenu: FC = () => {
    return (
        <AnimatePresence
            children={useUiContext().inlineStyleMenuInfo.isOpen && <Menu />}
        />
    )
}
export default InlineStyleMenu

function Menu() {
    const { editorState, setEditorState } = useEditorContext()
    const {
        inlineStyleMenuInfo: { getSelectionRect, domSelection, blockKey },
        dir,
    } = useUiContext()
    const { inlineStyles } = useTransformedPluginsContext()

    const [menuRef, setMenuRef] = useState<HTMLDivElement>(null)
    const virtualReference = useMemo(
        () => ({
            getBoundingClientRect: () => getSelectionRect() || new DOMRect(),
        }),
        [getSelectionRect, domSelection]
    )
    const popper = usePopper(virtualReference, menuRef, {
        placement: `top-${{ ltr: 'start', rtl: 'end' }[dir]}` as any,
    })

    const activeInlineStyles = getSelectionInlineStyle(editorState)
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(blockKey)
        .getType()

    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={{ initial: {}, animate: {}, exit: {} }}
            transition={{ staggerChildren: 0.02 }}
            className={styles.inlineStyleMenu}
            ref={setMenuRef}
            style={popper.styles.popper}
            {...popper.attributes.popper}>
            <Overlay
                className={styles.overlay}
                style={{
                    transform: `translateY( calc( ${
                        popper.styles.popper.top === '0' ? 1 : -1
                    } * .3rem ) )`,
                }}
                children={inlineStyles
                    .filter(({ ignoredBlockTypes }) => {
                        if (!ignoredBlockTypes) return true
                        return ignoredBlockTypes.indexOf(blockType) < 0
                    })
                    .map((inlineStyle, i) => (
                        <motion.div
                            key={i}
                            variants={{
                                initial: { opacity: 0, scale: 0.4 },
                                animate: { opacity: 1, scale: 1 },
                            }}
                            children={
                                inlineStyle.Component ? (
                                    //@ts-expect-error
                                    <inlineStyle.Component
                                        editorState={editorState}
                                        setEditorState={setEditorState}
                                    />
                                ) : (
                                    <ToggleInlineStyleButton
                                        inlineStyle={inlineStyle}
                                        active={
                                            activeInlineStyles[
                                                inlineStyle.style
                                            ]
                                        }
                                    />
                                )
                            }
                        />
                    ))}
            />
        </motion.div>
    )
}
