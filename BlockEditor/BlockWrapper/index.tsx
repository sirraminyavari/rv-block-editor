import cn from 'classnames'
import { direction as detectDirection } from 'direction'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import styles from './styles.module.scss'


const c = ( styles, classes ) => classes ? classes.map ( c => styles [ c ] ).join ( ' ' ) : ''

const BlockWrapper = ({ Comp, config = {} as any, children }) => {
    const { editorState } = useEditorContext ()
    const { dragInfo, blockRefs, externalStyles, dir } = useUiContext ()

    const { props: { block: outOfSyncBlock } } = children
    const blockKey = outOfSyncBlock.getKey ()
    const syncedBlock = editorState.getCurrentContent ().getBlockForKey ( blockKey )
    const text = syncedBlock.getText ()
    const direction = detectDirection ( text )

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
                dir = { direction === 'neutral' ? dir : direction }
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
