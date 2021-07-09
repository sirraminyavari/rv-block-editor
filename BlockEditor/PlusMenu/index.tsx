import { FC, useState, memo } from 'react'
import { TransformedPlusAction } from 'BlockEditor'
import { usePopper } from 'react-popper'
import Overlay from 'BlockEditor/Ui/Overlay'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useTransformedPluginsContext from 'BlockEditor/Contexts/TransformedPlugins'
import applyPlusActionToSelection from 'BlockEditor/Lib/applyPlusActionToSelection'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import { motion, AnimatePresence } from 'framer-motion'
import Scrollbar from 'react-perfect-scrollbar'

import styles from './styles.module.scss'


export default function PlusMenu () {
    const { plusActions }  = useTransformedPluginsContext ()
    const { plusMenuInfo: { openedBlock }, blockRefs, dir } = useUiContext ()
    return <AnimatePresence children = { !! openedBlock && <Popper
        blockKey = { openedBlock.getKey () }
        plusActions = { plusActions }
        blockRefs = { blockRefs }
        dir = { dir }
    /> } />
}

const Popper = memo ( ( { blockKey, plusActions, blockRefs, dir }: any ) => {
    const targetRef = blockRefs.current [ blockKey ]
    const [ pannelRef, setPannelRef ] = useState < HTMLDivElement > ( null )
    const popper = usePopper (
        targetRef?.querySelector ( '*' ), pannelRef,
        { placement: `bottom-${ { ltr: 'start', rtl: 'end' } [ dir ] }` as any }
    )
    const c = popper.styles.popper.top === '0' ? 1 : -1
    return <div
        className = { styles.plusMenu }
        ref = { setPannelRef }
        style = { popper.styles.popper }
        { ...popper.attributes.popper }
    >
        <Overlay
            initial = 'initial' animate = 'animate' exit = 'exit'
            variants = {{
                initial: { opacity: 0 },
                animate: { opacity: 1, transition: { duration: .5, ease: 'easeIn', staggerChildren: .05 } },
                exit: { opacity: 0, transition: { duration: .2, ease: 'easeOut' } }
            }}
            style = {{
                transform: `translateY( ${ .5 * c }rem )`
            }}
            className = { styles.overlay }
        >
            <Scrollbar
                className = { styles.scroll }
                options = {{
                    wheelPropagation: false,
                    suppressScrollX: true,
                    scrollingThreshold: 400
                }}
                children = { plusActions.map ( action => <ActionButton
                    key = { action.action }
                    action = { action }
                    blockKey = { blockKey }
                /> ) }
            />
        </Overlay>
    </div>
} )


interface ActionButtonProps {
    action: TransformedPlusAction
    blockKey: string
}

const ActionButton: FC < ActionButtonProps > = ({ action: { action, Icon, label }, blockKey }) => {
    const { editorState, setEditorState } = useEditorContext ()
    const { blockRefs, setBlockControlsInfo, setPlusMenuInfo } = useUiContext ()
    return <motion.label
        variants = {{
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
        }}
        transition = {{ ease: 'easeIn' }}
        className = { styles.actionButton }
        onMouseDown = { e => e.preventDefault () }
        onClick = { () => {
            setPlusMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
            setEditorState ( applyPlusActionToSelection ( editorState, action ) )
            setImmediate ( () => setBlockControlsInfo ( prev => ({ ...prev,
                hoveredBlockKey: blockKey,
                hoveredBlockElem: blockRefs.current [ blockKey ]
            }) ) )
        } }
    >
        <div className = { styles.iconWrapper }>
            <Icon />
        </div>
        <span className = { styles.label } children = { label } />
    </motion.label>
}
