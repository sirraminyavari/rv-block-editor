import cn from 'classnames'
import { direction as detectDirection } from 'direction'

import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import * as styles from './styles.module.scss'


const c = ( styles, classes ) => classes ? classes.map ( c => styles [ c ] ).join ( ' ' ) : ''

/**
 * This component wraps all the Content Blocks and provides a great deal of block editing functionality to them.
 */
const BlockWrapper = ({ Comp, config = {} as any, children,...rest }) => {
    const { editorState } = useEditorContext ()
    const { dragInfo, blockRefs, externalStyles, dir, blockLevelSelectionInfo, debugMode, collapsedBlocks } = useUiContext ()

    const { block: outOfSyncBlock } = children?.props || rest
    const blockKey = outOfSyncBlock.getKey ()
    const blockMap = editorState.getCurrentContent ().getBlockMap ()
    const syncedBlock = blockMap.get ( blockKey )
    const text = syncedBlock.getText ()
    const direction = detectDirection ( text )
    const depth = syncedBlock.getDepth ()

    if ( collapsedBlocks.isCollapsed ( blockKey ) ) return null

    const textAlign = syncedBlock.getData ().get ( '_align' )

    return <div
        ref = { elem => blockRefs.current [ blockKey ] = elem }
        data-block-key = { blockKey }
        className = { cn ( styles.blockWrapper, c ( externalStyles, config.styles?.wrapper ), {
            [ styles.dragging ]:
                dragInfo.dragging &&
                dragInfo.isDraggingByHandle &&
                dragInfo.block.getKey () === blockKey
            ,
            [ externalStyles.blockLevelSelected ]:
                blockLevelSelectionInfo.selectedBlockKeys.some ( k => k === blockKey )
        } ) }
        // @ts-ignore
        style = {{ '--depth': depth }}
        draggable = { dragInfo.isDraggingByHandle }
        { ...( debugMode ? { title: blockKey } : {} ) }
    >
        <div
            className = { c ( externalStyles, config.styles?.contentWrapper ) }
            dir = { direction === 'neutral' ? dir : direction }
            style = {{
                ...( textAlign ? { textAlign } : null )
            }}
        >
            <Comp
                className = { externalStyles.blockElement }
                children = { children }
                { ...( config.sendAdditionalProps ? {
                    editorState, block: syncedBlock
                } : {} ) }
            />
        </div>
    </div>
}
export default BlockWrapper

/**
 * An HOC to help wrap custom component inside a `BlockWrapper` and style them properly.
 */
export const withBlockWrapper = ( Comp, config?: any ) => props => {
    return <BlockWrapper
        Comp = { Comp }
        config = { config }
        { ...props }
    />
}
