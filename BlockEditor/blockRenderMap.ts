import { DefaultDraftBlockRenderMap, DraftBlockRenderMap } from 'draft-js'
import { Map } from 'immutable'

import { withBlockWrapper } from './BlockWrapper'


export const DefaultDraftBlockRenderMapWithBlockWrapper = Map (
    Object.entries ( DefaultDraftBlockRenderMap.toObject () )
        .map ( ([ key, val ]) => [ key, {
            ...val,
            element: withBlockWrapper ( val.element )
        } ] )
        .reduce ( ( acc, [ key, val ] ) => ({ ...acc, [ key ]: val }), {} )
) as DraftBlockRenderMap

const blockRenderMap: DraftBlockRenderMap = DefaultDraftBlockRenderMapWithBlockWrapper.merge ( Map ({
    // Custom Blocks
}) )
export default blockRenderMap
