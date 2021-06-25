import cn from 'classnames'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import DragHandle from 'BlockEditor/DragOverlay/DragHandle'
import getWrapperHandlers from 'BlockEditor/DragOverlay/getWrapperHandlers'
import { PlusMenuButton } from 'BlockEditor/PlusMenu'

import styles from './styles.module.scss'


const BlockWrapper = ({ Comp, ...props }) => {
    const { children } = props
    const { props: { block } } = children
    const { dragInfo, setDragInfo, blockRefs, plusMenuInfo } = useUiContext ()
    return <div
        ref = { elem => blockRefs.current [ block.key ] = elem }
        data-block-key = { block.key }
        className = { cn ( styles.blockWrapper, {
            [ styles.dragging ]:
                dragInfo.dragging &&
                dragInfo.isDraggingByHandle &&
                dragInfo.block.getKey () === block.getKey ()
        } ) }
        draggable = { dragInfo.isDraggingByHandle }
        { ...getWrapperHandlers ({ dragInfo, setDragInfo }) }
    >
        <div className = { cn ( styles.controls, {
            [ styles.invisible ]: plusMenuInfo.openedBlock
        } ) }>
            <PlusMenuButton block = { block } />
            <DragHandle block = { block } />
        </div>
        <div className = { styles.content }>
            <Comp children = { children } />
        </div>
    </div>
}
export default BlockWrapper

export const withBlockWrapper = Comp => props => <BlockWrapper
    Comp = { Comp }
    { ...props }
/>
