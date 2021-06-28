import { ContentBlock, genKey } from 'draft-js'
import { List } from 'immutable'


/**
 * @returns A new and empty Content Block.
 */
const createEmptyBlock = () => new ContentBlock ({
    key: genKey (),
    type: 'unstyled',
    text: '',
    characterList: List ()
})
export default createEmptyBlock
