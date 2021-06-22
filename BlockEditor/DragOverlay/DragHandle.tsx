import { FC } from 'react'
import useUiContext from 'BlockEditor/UiContext'

import styles from './styles.module.scss'


export interface DragHandleProps {
    setIsDragging: SetState < boolean >
}

const DragHandle: FC < DragHandleProps > = ({ setIsDragging }) => {
    const { editorRef } = useUiContext ()
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
