import { FC } from 'react'
import { ContentBlock } from 'draft-js'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import styles from './styles.module.scss'


export interface DragHandleProps {
    blockKey: string
}

const DragHandle: FC < DragHandleProps > = ({ blockKey }) => {
    const { editorState } = useEditorContext ()
    const block = editorState.getCurrentContent ().getBlockForKey ( blockKey )
    const { editorRef, setDragInfo } = useUiContext ()
    const setIsDragging = isDraggingByHandle => setDragInfo ( prev => ({ ...prev, isDraggingByHandle, block }) )
    return <div
        children = '='
        className = { styles.dragHandle }
        onMouseOver = { () => editorRef.current?.focus () }
        onMouseDown = { () => setIsDragging ( true ) }
        onMouseUp = { () => setIsDragging ( false ) }
        onDragEnd = { () => setIsDragging ( false ) }
    />
}
export default DragHandle
