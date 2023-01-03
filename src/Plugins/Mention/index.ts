import { CompositeDecorator } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'

import _createMentionPlugin, { MentionData } from '@draft-js-plugins/mention'

import MentionComponent from './MentionComponent'
import getOverlayComponent from './OverlayComponent'

import * as styles from './styles.module.scss'
import { MentionSuggestionsPubProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/MentionSuggestions'
import { FunctionComponent } from 'react'

export interface MentionItem extends MentionData {}

export type SuggestionsFilter =
    | ((search: string) => Promise<MentionItem[]>)
    | ((search: string, mentions: MentionItem[]) => MentionItem[])

export interface Config {
    mentions: MentionItem[]
    suggestionsFilter?: SuggestionsFilter
    ignoredBlockTypes?: string[]
}

export default function createMentionPlugin({
    mentions,
    suggestionsFilter,
    ignoredBlockTypes = [],
}: Config): EditorPlugin {
    const _plugin = _createMentionPlugin({
        entityMutability: 'SEGMENTED',
        mentionPrefix: '@',
        mentionComponent: MentionComponent,
        theme: styles,
    })

    return {
        id: 'mentions',

        ..._plugin,

        decorators: [
            new CompositeDecorator(
                _plugin.decorators.map(decorator => ({
                    ...decorator,
                    strategy: (contentBlock, callback, contentState) =>
                        ignoredBlockTypes.indexOf(contentBlock.getType()) >= 0
                            ? null
                            : (decorator as any).strategy(
                                  contentBlock,
                                  callback,
                                  contentState
                              ),
                })) as any
            ),
        ],

        OverlayComponent: getOverlayComponent({
            mentions,
            suggestionsFilter,
            MentionSuggestionsComp:
                _plugin.MentionSuggestions as FunctionComponent<MentionSuggestionsPubProps>,
        }),
    }
}
