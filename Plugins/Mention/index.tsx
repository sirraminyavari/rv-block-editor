import cn from 'classnames'

import { EditorPlugin } from 'BlockEditor'

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

export default function createMentionPlugin ( { mentions }: Config ): EditorPlugin {
    return {
        id: 'mentions',

        ..._createMentionPlugin ({
            entityMutability: 'IMMUTABLE'
        })
    }
}
