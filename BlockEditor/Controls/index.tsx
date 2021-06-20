import { FC } from 'react'
import { EditorState, RichUtils, Modifier, AtomicBlockUtils } from 'draft-js'
import { useEditorContext } from '../EditorContext'


const Controls: FC < any > = () => {
    const { editorState, setEditorState } = useEditorContext ()
    return <div>
        <button onMouseDown = { () => {
            setEditorState ( RichUtils.toggleInlineStyle ( editorState, 'BOLD' ) )
        } }>B</button>
        <button onMouseDown = { () => {
            const newContentState = Modifier [ editorState.getCurrentInlineStyle ().has ( 'red' )
                ? 'removeInlineStyle'
                : 'applyInlineStyle'
            ] (
                editorState.getCurrentContent (),
                editorState.getSelection (),
                'red'
            )
            const newEditorState = EditorState.push (
                editorState,
                newContentState,
                'change-inline-style'
            )
            setEditorState ( newEditorState )
        } }>red</button>
        <button onMouseDown = { () => {
            const contentState = editorState.getCurrentContent ()
            const contentStateWithEntity = contentState.createEntity ( 'LINK', 'MUTABLE', {
                url: 'http://www.zombo.com',
            } )
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey ()
            // const contentStateWithLink = Modifier.applyEntity (
            //     contentStateWithEntity,
            //     editorState.getSelection (),
            //     entityKey
            // )
            const newEditorState = EditorState.set ( editorState, {
                currentContent: contentStateWithEntity,
            } )
            setEditorState ( AtomicBlockUtils.insertAtomicBlock ( newEditorState, entityKey, '' ) )
        } }>Chips</button>
    </div>
}
export default Controls
