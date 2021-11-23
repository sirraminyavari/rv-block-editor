import { CompositeDecorator } from 'draft-js'
import cn from 'classnames'

import { EditorPlugin } from 'BlockEditor'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'

import _createMentionPlugin from '@draft-js-plugins/mention'

import styles from './styles.module.scss'


export interface MentionItem {
    name: string
    link: string
    avatar: string
    type: string
    type_label: string
}

export interface Config {
    mentions: MentionItem []
}

const _plugin = _createMentionPlugin ({
    entityMutability: 'IMMUTABLE'
})

export default function createMentionPlugin ( { mentions }: Config ): EditorPlugin {
    return {
        id: 'mentions',

        ..._plugin,

        decorators: [ new CompositeDecorator ( _plugin.decorators as any ) ],

        OverlayComponent: () => {
            const { editorState } = useEditorContext ()
            const a = editorState.getCurrentContent ().getBlockMap ().size
            return <div className = { styles.overlay }>
                <h1>Silam { a }</h1>
            </div>
        }
    }
}
