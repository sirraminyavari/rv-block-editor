
import { FC } from 'react'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import insertEmptyBlockBelowAndFocus from 'BlockEditor/Lib/insertEmptyBlockBelowAndFocus'
import forceSelectionToBlock from 'BlockEditor/Lib/forceSelectionToBlock'
import Button from 'BlockEditor/Ui/Button'
import { PlusIcon } from 'BlockEditor/icons'

import styles from './styles.module.scss'


export interface PlusMenuButtonProps {
    blockKey: string
}

const PlusMenuButton: FC < PlusMenuButtonProps > = ({ blockKey }) => {
    const { editorState, setEditorState } = useEditorContext ()
    const block = editorState.getCurrentContent ().getBlockForKey ( blockKey )
    const { setPlusMenuInfo } = useUiContext ()
    return <Button
        Icon = { PlusIcon }
        className = { styles.btn }
        onMouseDown = { e => e.preventDefault () }
        onClick = { () => {
            if ( ! block.getText () ) { // There is no text in the current block so we should update it's type inplace
                setEditorState ( forceSelectionToBlock ( editorState, blockKey ) )
                setPlusMenuInfo ( prev => ({ ...prev, openedBlock: block }) )
            } else { // There is some text in the current block so we should create a new block below it and set the plusAction type for the newly created block
                const { newEditorState, newContentBlock } = insertEmptyBlockBelowAndFocus ( editorState, block )
                setEditorState ( newEditorState )
                setPlusMenuInfo ( prev => ({ ...prev, openedBlock: newContentBlock }) )
            }
        } }
    />
}
export default PlusMenuButton
