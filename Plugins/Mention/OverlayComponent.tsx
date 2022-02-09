import { FC, ComponentType, useState, useMemo } from 'react'

import { defaultSuggestionsFilter } from '@draft-js-plugins/mention'
import { MentionSuggestionsPubProps } from '@draft-js-plugins/mention/lib/MentionSuggestions/MentionSuggestions.d'

import { MentionItem } from '.'

import * as styles from './styles.module.scss'


export interface OverlayComponentProps {
    mentions: MentionItem []
    MentionSuggestionsComp: ComponentType < MentionSuggestionsPubProps >
}

const OverlayComponent: FC < OverlayComponentProps > = ({ mentions, MentionSuggestionsComp }) => {
    const [ isOpen, setIsOpen ] = useState ( false )
    const [ suggestions, setSuggestions ] = useState ( mentions )

    const content = useMemo ( () => <MentionSuggestionsComp
        open = { isOpen }
        onOpenChange = { isOpen => setIsOpen ( isOpen ) }
        suggestions = { suggestions }
        onSearchChange = { ({ value }) => {
            setImmediate ( () => {
                const newSuggs = defaultSuggestionsFilter ( value, mentions )
                if ( suggestions.length !== newSuggs.length ) return void setSuggestions ( newSuggs )
                for ( const i in suggestions )
                    if ( suggestions [ i ].id !== newSuggs [ i ].id )
                        return void setSuggestions ( newSuggs )
            } )
        } }
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
    />, [
        MentionSuggestionsComp, isOpen,
        suggestions.map ( s => s.id ).join ()
    ] )

    return <div className = { styles.overlay } children = { content } />
}

export default function getOverlayComponent ( config: OverlayComponentProps ) {
    return props => <OverlayComponent
        { ...config }
        { ...props }
    />
}
