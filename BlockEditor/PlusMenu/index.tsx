import { FC, useState } from 'react'
import { ContentBlock } from 'draft-js'
import { PlusAction } from 'BlockEditor'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'
import Overlay from 'BlockEditor/Ui/Overlay'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import applyPlusActionToSelection from 'BlockEditor/Lib/applyPlusActionToSelection'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import { motion, AnimatePresence } from 'framer-motion'

import styles from './styles.module.scss'


export default function PlusMenu () {
    const { plusMenuInfo: { openedBlock } } = useUiContext ()
    return <AnimatePresence children = { !! openedBlock && <Popper block = { openedBlock } /> } />
}

function Popper ({ block }) {
    const { plusActions }  = useEditorContext ()
    const { blockRefs, dir } = useUiContext ()
    const targetRef = blockRefs.current [ block.getKey () ]
    const [ pannelRef, setPannelRef ] = useState < HTMLDivElement > ( null )
    const popper = usePopper (
        targetRef?.querySelector ( '*' ), pannelRef,
        { placement: `bottom-${ { ltr: 'start', rtl: 'end' } [ dir ] }` as any }
    )
    const c = popper.styles.popper.top === '0' ? 1 : -1
    return <Popover>
        <Popover.Panel static as = { motion.div }
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
                className = { styles.overlay }
                children = { plusActions.map ( action => <ActionButton
                    key = { action.action }
                    action = { action }
                    block = { block }
                /> ) }
            />
        </Popover.Panel>
    </Popover>
}


interface ActionButtonProps {
    action: PlusAction
    block: ContentBlock
}

const ActionButton: FC < ActionButtonProps > = ({ action: { action, Icon, label }, block }) => {
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
            const blockKey = block.getKey ()
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
