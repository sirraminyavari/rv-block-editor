import { EditorState, ContentState, ContentBlock, CompositeDecorator, Modifier } from 'draft-js'

import { EditorPlugin, InlineStyleComponent } from 'BlockEditor'
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
    active = { false }
    onClick = { () => {
        const contentState = editorState.getCurrentContent ()
        const selectionState = editorState.getSelection ()
        const contentStateWithEntity = contentState.createEntity ( 'LINK', 'MUTABLE', {
            url: 'http://www.zombo.com',
        } )
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
    // console.log ( contentBlock, callback, contentState )
    console.log ( 'here', !! contentBlock, !! contentState )
    contentBlock.findEntityRanges ( char => {
        const entityKey = char.getEntity ()
        if ( ! entityKey ) return false
        // FIXME: Might merge adjancend links
        return contentState.getEntity ( entityKey ).getType () === 'LINK'
    }, callback )
}

function Link ( props ) {
    console.log ( props )
    return <h1>wef</h1>
}
