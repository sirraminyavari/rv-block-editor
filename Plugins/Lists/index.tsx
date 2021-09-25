import { FC, LiHTMLAttributes } from 'react'
import cn from 'classnames'
import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { UnorderedListIcon, OrderedListIcon } from './icons'
import { ContentBlock, EditorState } from 'draft-js'

import styles from './styles.module.scss'


export default function createListsPlugin ( config: any = {} ): EditorPlugin {
    return {
        id: 'lists',

        plusActions: [
            { action: 'unordered-list-item', doubleBreakout: true, Icon: OrderedListIcon },
            { action: 'ordered-list-item', doubleBreakout: true, Icon: UnorderedListIcon }
        ],

        blockRenderMap: Map ({
            'unordered-list-item': {
                element: withBlockWrapper ( 'li' ),
                wrapper: <ul className = { cn ( 'public/DraftStyleDefault/ul', config.styles?.ul ) } />
            },
            'ordered-list-item': {
                element: withBlockWrapper ( OrderedListItem, { sendAdditionalProps: true } ),
                wrapper: <ol className = { cn ( 'public/DraftStyleDefault/ol', config.styles?.ol, styles.ol ) } />
            }
        }) as any
    }
}


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
