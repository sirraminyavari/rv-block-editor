import { useCallback, useRef } from 'react'
import { ContentState } from 'draft-js'

import useEditorContext from 'BlockEditor/Contexts/EditorContext'


/**
 * TODO: Docs
 */
export interface CollapsedBlocks {
    isCollapsed ( blockKey: string ): boolean
    clearChache ()
}

interface CacheNode {
    parent?: string
    isCollapsed: boolean
}

interface Cache {
    [ key: string ]: CacheNode
}

export default function useCollapsedBlocks ( contentState: ContentState ): CollapsedBlocks {
    const blockMap = contentState.getBlockMap ()
    const cache = useRef < Cache > ({})

    const getParentKey = useCallback ( ( blockKey: string ) => {
        console.log ( 'getParent' )
        const block = blockMap.get ( blockKey )
        const depth = block.getDepth ()
        if ( ! depth ) return null
        if ( cache.current [ blockKey ] ) return cache.current [ blockKey ].parent
        return blockMap
            .reverse ()
            .skipUntil ( ( _, k ) => k === blockKey )
            .skip ( 1 )
            .skipUntil ( b => b.getDepth () < depth )
            .first ()
            .getKey ()
    }, [ blockMap ] )

    const isCollapsed = useCallback ( ( blockKey: string ) => {
        const c = cache.current
        if ( c [ blockKey ] ) return c [ blockKey ].isCollapsed
        const parent = getParentKey ( blockKey )
        if ( ! parent ) {
            cache.current [ blockKey ] = { isCollapsed: false }
            return false
        }
        const collapsed = blockMap.get ( parent ).getData ().get ( '_collapsed' ) || isCollapsed ( parent )
        cache.current [ blockKey ] = { isCollapsed: collapsed, parent }
        return collapsed
    }, [ getParentKey ] )

    const clearChache = useCallback ( () => { cache.current = {} }, [] )
    return { isCollapsed, clearChache }
}
