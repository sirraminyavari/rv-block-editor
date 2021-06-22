import { useState } from 'react'
import cn from 'classnames'
import useUiContext from '../UiContext'

import DragHandle from '../DragOverlay/DragHandle'
import getWrapperHandlers from '../DragOverlay/getWrapperHandlers'
import PlusMenuButton from '../PlusMenuButton'

import styles from './styles.module.scss'


const BlockWrapper = ({ block, children }) => {
    const { setDragInfo, blockRefs } = useUiContext ()
    const [ isDragging, setIsDragging ] = useState ( false )
    return <div
        ref = { elem => blockRefs.current [ block.key ] = elem }
        data-block-key = { block.key }
        className = { cn ( styles.blockWrapper, {
            [ styles.dragging ]: isDragging
        } ) }
        draggable = { isDragging }
        { ...getWrapperHandlers ({ setIsDragging, setDragInfo }) }
    >
        <div className = { styles.controls }>
            <PlusMenuButton />
            <DragHandle setIsDragging = { setIsDragging } />
        </div>
        <div
            className = { styles.content }
            children = { children }
        />
    </div>
}
export default BlockWrapper
