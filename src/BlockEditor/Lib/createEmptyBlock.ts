import { ContentBlock, genKey } from 'draft-js'
import { List } from 'immutable'

/**
 * @returns A new and empty Content Block.
 */
const createEmptyBlock = (depth: number = 0) =>
  new ContentBlock({
    key: genKey(),
    type: 'unstyled',
    text: '',
    characterList: List(),
    depth,
  })
export default createEmptyBlock
