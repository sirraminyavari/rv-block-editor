import { FC } from 'react'
import { ContentBlock } from 'draft-js'
import useUiContext from 'BlockEditor/UiContext'

import styles from './styles.module.scss'


export interface DragHandleProps {
    block: ContentBlock
}

const DragHandle: FC < DragHandleProps > = ({ block }) => {
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
