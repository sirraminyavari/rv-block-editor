import { CompositeDecorator } from 'draft-js'
import cn from 'classnames'

import { EditorPlugin } from 'BlockEditor'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'

import _createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention'

import styles from './styles.module.scss'

import { useState, memo } from 'react'
import _ from 'lodash'


export interface MentionItem {
    id: string
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
    const _plugin = _createMentionPlugin ({
        entityMutability: 'IMMUTABLE',
        mentionComponent: ({ mention, ...props }) => <a href = { mention.link }>
            <span
                // { ...props }
                children = { '@' + props.decoratedText }
            />
        </a>
    })

    return {
        id: 'mentions',

        ..._plugin,

        decorators: [ new CompositeDecorator ( _plugin.decorators as any ) ],

        OverlayComponent: () => {
            const { MentionSuggestions } = _plugin;
            const { editorState } = useEditorContext ()
            const a = editorState.getCurrentContent ().getBlockMap ().size

            const [ isOpen, setIsOpen ] = useState ( false )
            const [ suggestions, setSuggestions ] = useState ( mentions )


            return <Comp
                MentionSuggestions = { MentionSuggestions }
                isOpen = { isOpen }
                setIsOpen = { setIsOpen }
                suggestions = { suggestions }
                setSuggestions = { setSuggestions }
                mentions = { mentions }
            />
        }
    }
}

const Comp = memo ( ({ MentionSuggestions, isOpen, setIsOpen, suggestions, setSuggestions, mentions }) => <div className = { styles.overlay }>
    <MentionSuggestions
        open = { isOpen }
        onOpenChange = { isOpen => setIsOpen ( isOpen ) }
        suggestions = { suggestions }
        onSearchChange = { ({ value }) => setSuggestions ( defaultSuggestionsFilter ( value, mentions ) as any ) }
        entryComponent = { props => {
            const index = mentions.findIndex ( x => x.name === props.mention.name )
            return <div
                // id = { index }
                key = { index }
                // { ..._.omit ( props, [ 'isFocused', 'searchValue', 'selectMention' ] ) }
            >
                <div>
                    <span>{ props.mention.name }</span>
                </div>
            </div>
        } }
    />
</div>, ( prevProps, nextProps ) => {
    if ( prevProps.isOpen !== nextProps.isOpen ) return false
    // todo: mentions
    if ( prevProps.suggestions.length !== nextProps.suggestions.length ) return false
    for ( const i in prevProps.suggestions )
        if ( prevProps.suggestions [ i ].id !== nextProps.suggestions [ i ].id ) return false
    return true
} )
