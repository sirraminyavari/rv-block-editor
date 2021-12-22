import { CompositeDecorator } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'

import _createMentionPlugin, { MentionData } from '@draft-js-plugins/mention'

import MentionComponent from './MentionComponent'
import getOverlayComponent from './OverlayComponent'


export interface MentionItem extends MentionData {}

export interface Config {
    mentions: MentionItem []
}

export default function createMentionPlugin ( { mentions }: Config ): EditorPlugin {
    const _plugin = _createMentionPlugin ({
        entityMutability: 'IMMUTABLE',
        mentionPrefix: '@',
        mentionComponent: MentionComponent
    })

    return {
        id: 'mentions',

        ..._plugin,

        decorators: [ new CompositeDecorator ( _plugin.decorators as any ) ],
        OverlayComponent: getOverlayComponent ({ mentions, MentionSuggestionsComp: _plugin.MentionSuggestions })
    }
}
