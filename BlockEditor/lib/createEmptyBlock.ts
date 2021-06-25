import { ContentBlock, genKey } from 'draft-js'
import { List } from 'immutable'


const createEmptyBlock = () => new ContentBlock ({
    key: genKey (),
    type: 'unstyled',
    text: '',
    characterList: List ()
})
export default createEmptyBlock
