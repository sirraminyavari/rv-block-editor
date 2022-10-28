import { StrategyFunction } from 'BlockEditor'

/**
 * A decorator strategy to find all ranges with an specified entity type.
 */
export default function makeEntityStrategy(entityType: string, ignoredBlockTypes: string[] = []): StrategyFunction {
    return (contentBlock, callback, contentState) => {
        if (ignoredBlockTypes.indexOf(contentBlock.getType()) >= 0) return
        contentBlock.findEntityRanges(char => {
            const entityKey = char.getEntity()
            if (!entityKey) return false
            // FIXME: Might merge adjancend entities
            return contentState.getEntity(entityKey).getType() === entityType
        }, callback)
    }
}
