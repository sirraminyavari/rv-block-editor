
import { FC, LiHTMLAttributes } from 'react'
import { ContentBlock, EditorState } from 'draft-js'
import cn from 'classnames'

import styles from './styles.module.scss'


export interface OrderedListItemProps extends LiHTMLAttributes < HTMLLIElement > {
    editorState: EditorState,
    block: ContentBlock
}

const OrderedListItem: FC < OrderedListItemProps > = ({ editorState, block, className, ...props }) => {
    const i = getI ( editorState, block )
    return <li
        className = { cn ( className, styles.olItem ) }
        style = {{
            // @ts-ignore
            '--i': i + 1
        }}
        { ...props }
    />
}
export default OrderedListItem

// FIXME: Terrible Performance
function getI ( editorState: EditorState, block: ContentBlock ): number {
    const contentState = editorState.getCurrentContent ()
    const depth = block.getDepth ()

    let prevBlock = contentState.getBlockBefore ( block.getKey () )
    let c = 0
    while ( prevBlock && prevBlock.getType () === 'ordered-list-item' && prevBlock.getDepth () >= depth ) {
        if ( prevBlock.getDepth () === depth )
            c ++
        prevBlock = contentState.getBlockBefore ( prevBlock.getKey () )
    }
    return c
}
