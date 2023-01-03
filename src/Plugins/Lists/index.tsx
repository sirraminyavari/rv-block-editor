import cn from 'classnames'
import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'

import { OrderedListItem, UnorderedListItem } from './ListItems'

import { UnorderedListIcon, OrderedListIcon } from './icons'
import * as styles from './styles.module.scss'

export default function createListsPlugin(config: any = {}): EditorPlugin {
    return {
        id: 'lists',

        plusActions: [
            {
                action: 'unordered-list-item',
                doubleBreakout: true,
                Icon: OrderedListIcon,
            },
            {
                action: 'ordered-list-item',
                doubleBreakout: true,
                Icon: UnorderedListIcon,
            },
        ],

        blockRenderMap: Map({
            'unordered-list-item': {
                element: withBlockWrapper(UnorderedListItem, {
                    sendAdditionalProps: true,
                }),
                wrapper: (
                    <ul
                        className={cn(
                            'public/DraftStyleDefault/ul',
                            config.styles?.ul,
                            styles.ul
                        )}
                    />
                ),
            },
            'ordered-list-item': {
                element: withBlockWrapper(OrderedListItem, {
                    sendAdditionalProps: true,
                }),
                wrapper: (
                    <ol
                        className={cn(
                            'public/DraftStyleDefault/ol',
                            config.styles?.ol,
                            styles.ol
                        )}
                    />
                ),
            },
        }) as any,
    }
}
