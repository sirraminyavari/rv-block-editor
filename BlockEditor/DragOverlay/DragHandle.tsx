import { FC } from 'react'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import Button from 'BlockEditor/Ui/Button'
import { FaGripVertical as DragIcon } from 'react-icons/fa'

import styles from './styles.module.scss'


export interface DragHandleProps {
    blockKey: string
}

const DragHandle: FC < DragHandleProps > = ({ blockKey }) => {
    const { editorState } = useEditorContext ()
    const block = editorState.getCurrentContent ().getBlockForKey ( blockKey )
    const { editorRef, setDragInfo, wrapperRef } = useUiContext ()
    return <Button
        Icon = { DragIcon }
        draggable = 'true'
        className = { styles.dragHandle }
        onMouseDown = { () => void 0 } // Override
        onMouseOver = { () => editorRef.current?.focus () }
        onDragStart = { () => setImmediate ( () => setDragInfo ( prev => ({
            ...prev, dragging: true, isDraggingByHandle: true, block,
            elem: wrapperRef.current.querySelector ( `[ data-block-key = "${ blockKey }" ]` )
        }) ) ) }
        onDragEnd = { () => setDragInfo ( prev => ({ ...prev, dragging: false, isDraggingByHandle: false }) ) }
    />
}
export default DragHandle
