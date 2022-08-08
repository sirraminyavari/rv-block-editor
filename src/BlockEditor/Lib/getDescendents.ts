import { BlockMap } from 'draft-js'

/**
 * @returns All decendents of a ContentBlock in order.
 */
export default function getDescendents(blockMap: BlockMap, targetKey: string): BlockMap {
    const targetDepth = blockMap.get(targetKey).getDepth()
    return blockMap
        .skipUntil((_, key) => key === targetKey)
        .skip(1)
        .takeWhile(b => b.getDepth() > targetDepth) as BlockMap
}
