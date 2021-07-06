import cn from 'classnames'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import styles from './styles.module.scss'


const c = ( styles, classes ) => classes ? classes.map ( c => styles [ c ] ).join ( ' ' ) : ''

// * Caveat: Wrappers will not stay in sync with editorState; Pass everything by key
const BlockWrapper = ({ Comp, config = {} as any, ...props }) => {
    const { children } = props
    const { props: { block } } = children
    const blockKey = block.getKey ()
    const { dragInfo, blockRefs, externalStyles } = useUiContext ()
    return <div
        ref = { elem => blockRefs.current [ blockKey ] = elem }
        data-block-key = { blockKey }
        className = { cn ( styles.blockWrapper, c ( externalStyles, config.styles?.wrapper ), {
            [ styles.dragging ]:
                dragInfo.dragging &&
                dragInfo.isDraggingByHandle &&
                dragInfo.block.getKey () === blockKey
        } ) }
        draggable = { dragInfo.isDraggingByHandle }
    >
        <div className = { c ( externalStyles, config.styles?.contentWrapper ) }>
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
