import { FC } from 'react'
import { TransformedPlusAction } from 'BlockEditor'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import applyPlusActionToSelection from 'BlockEditor/Lib/applyPlusActionToSelection'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import { motion } from 'framer-motion'

import styles from './styles.module.scss'


export interface PlusActionButtonProps {
    action: TransformedPlusAction
    blockKey: string
}

const PlusActionButton: FC < PlusActionButtonProps > = ({ action: { action, Icon, label }, blockKey }) => {
    const { editorState, setEditorState } = useEditorContext ()
    const { blockRefs, setBlockControlsInfo, setPlusMenuInfo } = useUiContext ()
    return <motion.label
        variants = {{
            initial: { opacity: 0, x: 40 },
            animate: { opacity: 1, x: 0 },
        }}
        transition = {{ ease: 'easeIn' }}
        className = { styles.plusActionButton }
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
export default PlusActionButton
