import { EditorState, ContentState, ContentBlock, CompositeDecorator, Modifier, EditorBlock } from 'draft-js'

import { EditorPlugin, InlineStyleComponent, DecoratorComponent } from 'BlockEditor'
import Button from 'BlockEditor/Ui/Button'

import { LinkIcon } from './icons'


export default function createLinksPlugin (): EditorPlugin {
    return {
        id: 'links',

        inlineStyles: [
            { Component: LinkButton }
        ],

        decorators: [
            new CompositeDecorator ([{ strategy: findLinkEntities, component: Link }])
        ]
    }
}


const LinkButton: InlineStyleComponent = ({ editorState, setEditorState }) => <Button
    Icon = { LinkIcon }
    active = { false } // TODO:
    onClick = { () => {
        const href = prompt ( "Please enter a URL:", "https://nextle.net" )
        if ( ! href ) return
        const contentState = editorState.getCurrentContent ()
        const selectionState = editorState.getSelection ()
        const contentStateWithEntity = contentState.createEntity ( 'LINK', 'MUTABLE', { href } )
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey ()
        const contentStateWithLink = Modifier.applyEntity (
            contentStateWithEntity,
            selectionState,
            entityKey
        )
        const newEditorState = EditorState.set ( editorState, {
            currentContent: contentStateWithLink
        } )
        setEditorState ( newEditorState )
    } }
/>


function findLinkEntities ( contentBlock: ContentBlock, callback, contentState: ContentState ) {
    contentBlock.findEntityRanges ( char => {
        const entityKey = char.getEntity ()
        if ( ! entityKey ) return false
        // FIXME: Might merge adjancend links
        return contentState.getEntity ( entityKey ).getType () === 'LINK'
    }, callback )
}

const Link: DecoratorComponent = ({ contentState, entityKey, children }) => {
    const entity = contentState.getEntity ( entityKey )
    if ( ! entity ) return children
    const { href } = entity.getData ()
    return <a
        href = { href }
        target = '_blank'
        children = { children }
    />
}
