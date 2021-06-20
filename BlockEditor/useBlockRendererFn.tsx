import { useCallback } from 'react'
import { ContentBlock, EditorBlock } from 'draft-js'

import useEditorContext from './EditorContext'
import BlockWrapper from './BlockWrapper'


export default function useBlockRendererFn () {
    const { setDragInfo, blockRefs } = useEditorContext ()

    return useCallback ( ( contentBlock: ContentBlock ) => {
        const type = contentBlock.getType ()
        // console.log ( 'TYPE', type )
        return {
            component: props => {
                const entityKey = props.block.getEntityAt ( 0 )
                if ( props.block.getType () === 'atomic' ) {
                    if ( entityKey ) {
                        const entity = props.contentState.getEntity ( entityKey )
                        // console.log ( 'entity', entity.type, entity.getData () )
                    }
                }
                return <BlockWrapper
                    ref = { elem => blockRefs.current [ props.block.key ] = elem }
                    data-block-key = { props.block.key }
                    onDragStart = { e => setImmediate ( () => setDragInfo ({ dragging: true, elem: e.target }) ) }
                    onDragEnd = { () => setImmediate ( () => setDragInfo ({ dragging: false, elem: null }) ) }
                >
                    <EditorBlock { ...props } />
                </BlockWrapper>
            },
            editable: true,
            props: {
                foo: 'bar'
            }
        }
    }, [ setDragInfo ] )
}
