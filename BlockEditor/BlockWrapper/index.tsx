import cn from 'classnames'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import DragHandle from 'BlockEditor/DragOverlay/DragHandle'
import getWrapperHandlers from 'BlockEditor/DragOverlay/getWrapperHandlers'
import { PlusMenuButton } from 'BlockEditor/PlusMenu'

import styles from './styles.module.scss'


const c = ( styles, classes ) => classes ? classes.map ( c => styles [ c ] ).join ( ' ' ) : ''

// * Caveat: Wrappers will not stay in sync with editorState; Pass everything by key
const BlockWrapper = ({ Comp, config = {} as any, ...props }) => {
    const { children } = props
    const { props: { block } } = children
    const blockKey = block.getKey ()
    const { dragInfo, setDragInfo, blockRefs, plusMenuInfo, externalStyles } = useUiContext ()
    return <div
        ref = { elem => blockRefs.current [ block.key ] = elem }
        data-block-key = { block.key }
        className = { cn ( styles.blockWrapper, c ( externalStyles, config.styles?.wrapper ), {
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
            <div>
                <PlusMenuButton blockKey = { blockKey } />
                <DragHandle blockKey = { blockKey } />
            </div>
        </div>
        <div className = { cn ( styles.content, c ( externalStyles, config.styles?.contentWrapper ) ) }>
            <Comp
                className = { externalStyles.blockElement }
                children = { children }
            />
        </div>
    </div>
}
export default BlockWrapper

export const withBlockWrapper = ( Comp, config?: any ) => props => {
    return <BlockWrapper
        Comp = { Comp }
        config = { config }
        { ...props }
    />
}
