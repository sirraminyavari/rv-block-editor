
import { FC, LiHTMLAttributes } from 'react'
import { ContentBlock, EditorState } from 'draft-js'
import cn from 'classnames'

import styles from './styles.module.scss'


export interface ListItemProps extends LiHTMLAttributes < HTMLLIElement > {
    editorState: EditorState,
    block: ContentBlock
}

export const OrderedListItem: FC < ListItemProps > = ({ editorState, block, className, ...props }) => {
    const i = getI ( editorState, block )
    const depth = block.getDepth ()
    return <li
        className = { cn ( className, styles.olItem, styles [ `style-${ depth % 3 }` ] ) }
        style = {{
            // @ts-ignore
            '--i': i + 1
        }}
        { ...props }
    />
}

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

export const UnorderedListItem: FC < ListItemProps > = ({ editorState, block, className, ...props }) => {
    const depth = block.getDepth ()
    return <li
        className = { cn ( className, styles.ulItem, styles [ `style-${ depth % 3 }` ] ) }
        { ...props }
    />
}
