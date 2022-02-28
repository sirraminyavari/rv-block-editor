import { FC, ComponentType, useState, useMemo } from 'react'
import _ from 'lodash'

import { defaultSuggestionsFilter } from '@draft-js-plugins/mention'
import { MentionSuggestionsPubProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/MentionSuggestions.d'

import { MentionItem, SuggestionsFilter } from '.'


export interface OverlayComponentProps {
    mentions: MentionItem []
    suggestionsFilter: SuggestionsFilter
    MentionSuggestionsComp: ComponentType < MentionSuggestionsPubProps >
}

const OverlayComponent: FC < OverlayComponentProps > = ({ mentions, suggestionsFilter, MentionSuggestionsComp }) => {
    const [ isOpen, setIsOpen ] = useState ( false )
    const [ suggestions, setSuggestions ] = useState ( mentions )

    const content = useMemo ( () => <MentionSuggestionsComp
        open = { isOpen }
        onOpenChange = { isOpen => setIsOpen ( isOpen ) }
        suggestions = { suggestions }
        onSearchChange = { ({ value }) => {
            setImmediate ( async () => {
                const newSuggs = await ( suggestionsFilter || defaultSuggestionsFilter ) ( value, mentions )
                if ( suggestions.length !== newSuggs.length ) return setSuggestions ( newSuggs )
                for ( const i in suggestions )
                    if ( suggestions [ i ].id !== newSuggs [ i ].id )
                        return setSuggestions ( newSuggs )
            } )
        } }
        entryComponent = { props => {
            return <div { ..._.omit ( props, [ 'isFocused', 'searchValue', 'selectMention' ] ) }>
                <span>{ props.mention.name }</span>
            </div>
        } }
    />, [
        MentionSuggestionsComp, isOpen,
        suggestions.map ( s => s.id ).join ()
    ] )

    return <div children = { content } />
}

export default function getOverlayComponent ( config: OverlayComponentProps ) {
    return props => <OverlayComponent
        { ...config }
        { ...props }
    />
}
