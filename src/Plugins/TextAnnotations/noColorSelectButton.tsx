import { FC } from 'react'
import { EditorState, Modifier } from 'draft-js'
import { IconType } from 'react-icons'

import { InlineStyleComponentProps } from 'BlockEditor'
import Overlay from 'BlockEditor/Ui/Overlay'
import Button from 'BlockEditor/Ui/Button'

import { ColorConfig } from '.'

import * as styles from './styles.module.scss'
import { OrderedSet } from 'immutable'
import { NoColorIcon } from './icons'

export interface NoColorSelectButtonProps extends InlineStyleComponentProps {
    styleEntities: string[]
}

const NoColorSelectButton: FC<NoColorSelectButtonProps> = ({ styleEntities, editorState, setEditorState }) => {
    const handleClearClick = (editorState: EditorState) => {
        const selection = editorState.getSelection()
        const contentState = editorState.getCurrentContent()
        const anchorKey = selection.getAnchorKey()
        const currentContent = editorState.getCurrentContent()
        const currentContentBlock = currentContent.getBlockForKey(anchorKey)
        const selectionStart = selection.getStartOffset()
        const selectionEnd = selection.getEndOffset()
        const selectedText = currentContentBlock.getText().slice(selectionStart, selectionEnd)
        const selectionStyles = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getInlineStyleAt(selection.getStartOffset())
            .toArray()
        const newState = Modifier.replaceText(
            contentState,
            selection,
            selectedText,
            OrderedSet(selectionStyles.filter(style => !styleEntities.includes(style)))
        )

        setEditorState(EditorState.push(editorState, newState, 'change-inline-style'))
    }
    return (
        <>
            <Button
                className={styles.button}
                style={{ display: 'flex', alignItems: 'center' }}
                onClick={() => handleClearClick(editorState)}>
                <NoColorIcon />
            </Button>
        </>
    )
}

export default NoColorSelectButton
