import { CompositeDecorator } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'

import _createMentionPlugin, { MentionData } from '@draft-js-plugins/mention'

import MentionComponent from './MentionComponent'
import getOverlayComponent from './OverlayComponent'

import * as styles from './styles.module.scss'


export interface MentionItem extends MentionData {}

export type SuggestionsFilter =
    ( ( search: string ) => Promise < MentionItem [] > ) |
    ( ( search: string, mentions: MentionItem [] ) => MentionItem [] )

export interface Config {
    mentions: MentionItem []
    suggestionsFilter?: SuggestionsFilter
}

export default function createMentionPlugin ( { mentions, suggestionsFilter }: Config ): EditorPlugin {
    const _plugin = _createMentionPlugin ({
        entityMutability: 'IMMUTABLE',
        mentionPrefix: '@',
        mentionComponent: MentionComponent,
        theme: styles
    })

    return {
        id: 'mentions',

        ..._plugin,

        decorators: [ new CompositeDecorator ( _plugin.decorators as any ) ],
        OverlayComponent: getOverlayComponent ({
            mentions, suggestionsFilter,
            MentionSuggestionsComp: _plugin.MentionSuggestions
        })
    }
}
