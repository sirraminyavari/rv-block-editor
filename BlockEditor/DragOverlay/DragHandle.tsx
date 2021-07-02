import { FC } from 'react'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import styles from './styles.module.scss'


export interface DragHandleProps {
    blockKey: string
}

const DragHandle: FC < DragHandleProps > = ({ blockKey }) => {
    const { editorState } = useEditorContext ()
    const block = editorState.getCurrentContent ().getBlockForKey ( blockKey )
    const { editorRef, setDragInfo, wrapperRef } = useUiContext ()
    return <div
        draggable = 'true'
        children = '='
        className = { styles.dragHandle }
        onMouseOver = { () => editorRef.current?.focus () }
        onDragStart = { () => setImmediate ( () => setDragInfo ( prev => ({
            ...prev, dragging: true, isDraggingByHandle: true, block,
            elem: wrapperRef.current.querySelector ( `[ data-block-key = "${ blockKey }" ]` )
        }) ) ) }
        onDragEnd = { () => setDragInfo ( prev => ({ ...prev, dragging: false, isDraggingByHandle: false }) ) }
    />
}
export default DragHandle
