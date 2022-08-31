import { FC } from 'react'
import { EditorState, SelectionState } from 'draft-js'

import useEditorContext from '../Contexts/EditorContext'
import useUiContext from '../Contexts/UiContext'
import Button from '../Ui/Button'
import { DragHandleIcon } from '../icons'

import * as styles from './styles.module.scss'

export interface DragHandleProps {
    blockKey: string
}

/**
 * A block control that starts dragging procedures on a given Content Block.
 */
const DragHandle: FC<DragHandleProps> = ({ blockKey }) => {
    const { editorState, setEditorState } = useEditorContext()
    const block = editorState.getCurrentContent().getBlockForKey(blockKey)
    const { setDragInfo, wrapperRef } = useUiContext()
    return (
        <Button
            Icon={DragHandleIcon}
            draggable="true"
            className={styles.dragHandle}
            onMouseDown={() => void 0} // Override
            onDragStart={e => {
                e.dataTransfer.setDragImage(new Image(), 0, 0)
                setImmediate(() =>
                    setDragInfo(prev => ({
                        ...prev,
                        dragging: true,
                        isDraggingByHandle: true,
                        block,
                        elem: wrapperRef.current.querySelector(`[ data-block-key = "${blockKey}" ]`),
                    }))
                )
            }}
            onDragEnd={() =>
                setDragInfo(prev => ({
                    ...prev,
                    dragging: false,
                    isDraggingByHandle: false,
                }))
            }
            onClick={() =>
                setImmediate(() => {
                    const newSelectionState = new SelectionState({
                        anchorKey: blockKey,
                        focusKey: blockKey,
                        anchorOffset: 0,
                        focusOffset: block.getLength(),
                        isBackward: false,
                        hasFocus: true,
                    })
                    const newEditorState = EditorState.forceSelection(editorState, newSelectionState)
                    setEditorState(newEditorState)
                })
            }
        />
    )
}
export default DragHandle
