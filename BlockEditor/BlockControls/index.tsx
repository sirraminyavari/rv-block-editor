import { useState, useEffect } from 'react'
import cn from 'classnames'
import { PlusMenuButton } from 'BlockEditor/PlusMenu'
import DragHandle from 'BlockEditor/DragOverlay/DragHandle'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import styles from './styles.module.scss'


export default function BlockControls () {
    const { editorState } = useEditorContext ()
    const {
        blockControlsInfo: { hoveredBlockKey, hoveredBlockElem },
        plusMenuInfo, wrapperRef, innerWrapperRef
    } = useUiContext ()

    const [ rect  , setRect   ] = useState < DOMRect > ( () => new DOMRect () )
    const [ owRect, setOwRect ] = useState < DOMRect > ( () => new DOMRect () )
    const [ iwRect, setIwRect ] = useState < DOMRect > ( () => new DOMRect () )
    useEffect ( () => {
        setRect ( hoveredBlockElem.getBoundingClientRect () )
        setOwRect ( wrapperRef.current.getBoundingClientRect () )
        setIwRect ( innerWrapperRef.current.getBoundingClientRect () )
    }, [ editorState, hoveredBlockKey, hoveredBlockElem ] )

    return <div
        className = { cn ( styles.controls, {
            [ styles.invisible ]: plusMenuInfo.openedBlock
        } ) }
        style = {{ // @ts-ignore
            '--x': iwRect.x - owRect.x,
            '--y': rect?.y ? ( rect.y + rect.bottom ) / 2 - owRect.y : iwRect.y - owRect.y
        }}
    >
        <PlusMenuButton blockKey = { hoveredBlockKey } />
        <DragHandle blockKey = { hoveredBlockKey } />
    </div>
}
