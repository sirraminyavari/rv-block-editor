import cn from 'classnames'
import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { CheckableListIcon } from './icons'

import _createCheckableListPlugin from 'draft-js-checkable-list-plugin'
import 'draft-js-checkable-list-plugin/lib/plugin.css'

import styles from './styles.module.scss'


const _plugin = _createCheckableListPlugin ()
const checkableListItem = _plugin.blockRenderMap.get ( 'checkable-list-item' )

export default function createCheckableListPlugin ( config: any = {} ): EditorPlugin {
    return {
        id: 'checkable-list',

        ..._plugin,

        blockRenderMap: Map ({
            'checkable-list-item': {
                ...checkableListItem,
                element: withBlockWrapper ( checkableListItem.element ),
                wrapper: {
                    ...checkableListItem.wrapper,
                    props: {
                        ...checkableListItem.wrapper.props,
                        className: cn ( checkableListItem.wrapper.props.className, config.styles?.cl, styles.cl )
                    }
                }
            }
        }),

        plusActions: [
            { action: 'checkable-list-item', Icon: CheckableListIcon }
        ]
    }
}
