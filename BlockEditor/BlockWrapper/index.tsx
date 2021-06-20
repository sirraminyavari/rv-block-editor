import { useState } from 'react'
import cn from 'classnames'
import useEditorContext from '../EditorContext'

import styles from './styles.module.scss'


const BlockWrapper = ({ block, children }) => {
    const { setDragInfo, blockRefs, editorRef } = useEditorContext ()
    const [ isDragging, setIsDragging ] = useState ( false )
    return <div
        ref = { elem => blockRefs.current [ block.key ] = elem }
        data-block-key = { block.key }
        className = { cn ( styles.blockWrapper, {
            [ styles.dragging ]: isDragging
        } ) }
        draggable = { isDragging }
        onDragStart = { e => setImmediate ( () => setDragInfo ({ dragging: true, elem: e.target as HTMLDivElement }) ) }
        onDragEnd = { () => {
            setIsDragging ( false )
            setImmediate ( () => setDragInfo ({ dragging: false, elem: null }) )
        } }
    >
        <div className = { styles.controls }>
            <button
                className = { cn ( styles.control, styles.addBlcok ) }
                children = '+'
            />
            <div
                className = { cn ( styles.control, styles.dragHandle ) }
                onMouseOver = { () => editorRef.current?.focus () }
                onMouseDown = { () => setIsDragging ( true ) }
                onMouseUp = { () => setIsDragging ( false ) }
                onDragEnd = { () => setIsDragging ( false ) }
                children = '='
            />
        </div>
        <div
            className = { styles.content }
            children = { children }
        />
    </div>
}
export default BlockWrapper
