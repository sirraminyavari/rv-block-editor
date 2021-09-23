import { DropTarget } from '.'


export default function calcMaxDepth ( dropTarget?: DropTarget ) {
    if ( ! dropTarget ) return null
    const { insertionMode, contentBlock, prevPosInfo } = dropTarget
    if ( ! insertionMode ) return null
    return {
        before: () => prevPosInfo?.contentBlock.getDepth () + 1 || 0,
        after: () => contentBlock.getDepth () + 1
    } [ insertionMode ] ()
}
