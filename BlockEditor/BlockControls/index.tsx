import cn from 'classnames'
import { PlusMenuButton } from 'BlockEditor/PlusMenu'
import DragHandle from 'BlockEditor/DragOverlay/DragHandle'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import styles from './styles.module.scss'


export default function BlockControls () {
    const {
        blockControlsInfo: { isMouseOnEditor, hoveredBlockKey, hoveredBlockRect: rect },
        plusMenuInfo, wrapperRef, innerWrapperRef
    } = useUiContext ()
    const owRect = wrapperRef.current.getBoundingClientRect ()
    const iwRect = innerWrapperRef.current.getBoundingClientRect ()
    return <div
        className = { cn ( styles.controls, {
            [ styles.visible ]: isMouseOnEditor && ! plusMenuInfo.openedBlock
        } ) }
        style = {{ // @ts-ignore
            '--x': iwRect.x - owRect.x, '--y': rect?.y ? ( rect.y + rect.bottom ) / 2 - owRect.y : iwRect.y - owRect.y
        }}
    >
        <PlusMenuButton blockKey = { hoveredBlockKey } />
        <DragHandle blockKey = { hoveredBlockKey } />
    </div>
}
