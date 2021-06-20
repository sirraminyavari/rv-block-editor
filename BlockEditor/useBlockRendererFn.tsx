import { useCallback } from 'react'
import { ContentBlock, EditorBlock } from 'draft-js'

import BlockWrapper from './BlockWrapper'


export default function useBlockRendererFn () {
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
                return <BlockWrapper { ...props }>
                    <EditorBlock { ...props } />
                </BlockWrapper>
            },
            editable: true,
            props: {
                foo: 'bar'
            }
        }
    }, [] )
}
