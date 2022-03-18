import { useCallback, useRef } from 'react'
import { ContentBlock, ContentState } from 'draft-js'


export interface CollapsedBlocks {
    // Calculates a block's collaption status
    isCollapsed ( blockKey: string ): boolean
    // Clears the memoization cache
    clearChache ()
}

interface CacheNode {
    parent?: string
    isCollapsed: boolean
}

interface Cache {
    [ key: string ]: CacheNode
}

/**
 * Provides functionality for calculating and memoizing each block's collapsion status
 */
export default function useCollapsedBlocks ( contentState: ContentState ): CollapsedBlocks {
    const blockMap = contentState.getBlockMap ()
    const cache = useRef < Cache > ({})

    const getParent = useCallback ( ( blockKey: string ) => {
        const block = blockMap.get ( blockKey )
        const depth = block.getDepth ()
        if ( ! depth ) return null
        if ( cache.current [ blockKey ] )
            return blockMap.get ( cache.current [ blockKey ].parent )
        return blockMap
            .reverse ()
            .skipUntil ( ( _, k ) => k === blockKey )
            .skip ( 1 )
            .skipUntil ( b => b.getDepth () < depth )
            .first () as ContentBlock
    }, [ blockMap ] )

    const isCollapsed = useCallback ( ( blockKey: string ) => {
        const c = cache.current
        if ( c [ blockKey ] ) return c [ blockKey ].isCollapsed
        const parent = getParent ( blockKey )
        if ( ! parent ) {
            cache.current [ blockKey ] = { isCollapsed: false }
            return false
        }
        const collapsed = parent.getData ().get ( '_collapsed' ) || isCollapsed ( parent )
        cache.current [ blockKey ] = { isCollapsed: collapsed, parent: parent.getKey () }
        return collapsed
    }, [ getParent ] )

    const clearChache = useCallback ( () => { cache.current = {} }, [] )
    return { isCollapsed, clearChache }
}
