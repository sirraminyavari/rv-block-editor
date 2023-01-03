import { EditorState, Modifier } from 'draft-js'

import { InlineStyleComponent } from 'BlockEditor'
import Button from 'BlockEditor/Ui/Button'

import { LinkIcon } from './icons'

const LinkButton: InlineStyleComponent = ({ editorState, setEditorState }) => (
    <Button
        Icon={LinkIcon}
        active={false} // TODO:
        onClick={() => {
            const href = prompt('Please enter a URL:', 'https://nextle.net')
            if (!href) return
            const contentState = editorState.getCurrentContent()
            const selectionState = editorState.getSelection()
            const contentStateWithEntity = contentState.createEntity(
                'LINK',
                'MUTABLE',
                { href }
            )
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
            const contentStateWithLink = Modifier.applyEntity(
                contentStateWithEntity,
                selectionState,
                entityKey
            )
            const newEditorState = EditorState.set(editorState, {
                currentContent: contentStateWithLink,
            })
            setEditorState(newEditorState)
        }}
    />
)
export default LinkButton
