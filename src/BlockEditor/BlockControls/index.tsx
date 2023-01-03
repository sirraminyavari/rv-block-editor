import { useState, useEffect } from 'react'
import cn from 'classnames'

import PlusActionMenuButton from '../PlusActionMenu/PlusActionMenuButton'
import DragHandle from '../DnD/DragHandle'
import useEditorContext from '../Contexts/EditorContext'
import useUiContext from '../Contexts/UiContext'

import * as styles from './styles.module.scss'

/**
 * The general block controls that apear at the beggining of blocks when the user hovers on them.
 * * It will not appear when `PlusActionMenu` is open.
 */
export default function BlockControls() {
    const { editorState } = useEditorContext()
    const {
        blockControlsInfo: { hoveredBlockKey, hoveredBlockElem },
        plusActionMenuInfo,
        wrapperRef,
        innerWrapperRef,
    } = useUiContext()

    const [rect, setRect] = useState<DOMRect>(() => new DOMRect())
    const [owRect, setOwRect] = useState<DOMRect>(() => new DOMRect())
    const [iwRect, setIwRect] = useState<DOMRect>(() => new DOMRect())
    useEffect(() => {
        setRect(hoveredBlockElem?.getBoundingClientRect())
        setOwRect(wrapperRef.current?.getBoundingClientRect())
        setIwRect(innerWrapperRef.current?.getBoundingClientRect())
    }, [editorState, hoveredBlockKey, hoveredBlockElem])
    if (!(rect && owRect && iwRect)) return null

    const hoveredBlockDepth =
        editorState
            .getCurrentContent()
            .getBlockForKey(hoveredBlockKey)
            ?.getDepth() | 0

    return (
        <div
            className={cn(styles.controls, {
                [styles.invisible]: plusActionMenuInfo.openedBlock,
            })}
            style={{
                // @ts-ignore
                '--x': `calc( ${
                    iwRect.x - owRect.x
                }px + var( --nest-padding ) * ${hoveredBlockDepth} )`,
                '--y': `${
                    rect?.y
                        ? (rect.y + rect.bottom) / 2 - owRect.y
                        : iwRect.y - owRect.y
                }px`,
            }}>
            <div>
                <PlusActionMenuButton blockKey={hoveredBlockKey} />
                <DragHandle blockKey={hoveredBlockKey} />
            </div>
        </div>
    )
}
