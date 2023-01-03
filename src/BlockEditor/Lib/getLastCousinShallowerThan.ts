import { BlockMap, ContentBlock } from 'draft-js'

/**
 * @returns The last cousin of a block which is shallower than a certain depth (self included).
 */
export default function getLastCousinShallowerThan(
    blockMap: BlockMap,
    targetKey: string,
    depth: number
): ContentBlock {
    const trimmedBlockMap = blockMap.skipUntil((_, key) => key === targetKey)
    const targetBlock = trimmedBlockMap.first()
    if (targetBlock.getDepth() === depth) {
        const restBlockMap = trimmedBlockMap.skip(1)
        const nextBlock = restBlockMap.first()
        if (!nextBlock || nextBlock.getDepth() <= depth) return targetBlock
        return getLastCousinShallowerThan(
            restBlockMap as BlockMap,
            nextBlock.getKey(),
            depth
        )
    }
    return trimmedBlockMap.takeUntil(block => block.getDepth() <= depth).last()
}
