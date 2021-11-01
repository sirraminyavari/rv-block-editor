import { EditorPlugin } from 'BlockEditor'

import Button from 'BlockEditor/Ui/Button'
import mergeBlockDataByKey from 'BlockEditor/Lib/mergeBlockDataByKey'

import styles from './styles.module.scss'
import { EditorState } from 'draft-js'


export default function createBlockAlignmentPlugin (): EditorPlugin {
    return {
        id: 'block-alignment',

        inlineStyles: [{ Component: ({ editorState, setEditorState }) => {
            return <div className = { styles.buttonWrapper }>
                <Button
                    onClick = { () => setTextAlignment ( 'left', editorState, setEditorState ) }
                    children = 'L'
                />
                <Button
                    onClick = { () => setTextAlignment ( 'center', editorState, setEditorState ) }
                    children = 'C'
                />
                <Button
                    onClick = { () => setTextAlignment ( 'right', editorState, setEditorState ) }
                    children = 'R'
                />
            </div>
        } }]
    }
}

type Alignment = 'left' | 'center' | 'right'

// TODO: Reset alignment
function setTextAlignment (
    align: Alignment,
    editorState: EditorState,
    setEditorState: SetState < EditorState >
) {
    const selectionState = editorState.getSelection ()
    const blockKey = selectionState.getAnchorKey ()
    const newEditorState = mergeBlockDataByKey (
        editorState,
        blockKey,
        { _align: align }
    )
    setEditorState ( newEditorState )
}
