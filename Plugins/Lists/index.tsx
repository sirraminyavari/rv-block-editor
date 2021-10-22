import cn from 'classnames'
import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { UnorderedListIcon, OrderedListIcon } from './icons'

import OrderedListItem from './OrderedListItem'

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
