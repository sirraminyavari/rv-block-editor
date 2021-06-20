import { useState, forwardRef, HTMLAttributes } from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'


const BlockWrapper = forwardRef < HTMLDivElement, HTMLAttributes < HTMLDivElement > > ( ( { children, onDragEnd, ...rest }, ref ) => {
    const [ f, setF ] = useState ( false )
    const isDragging = f
    return <div
        ref = { ref }
        className = { cn ( styles.blockWrapper, {
            [ styles.dragging ]: isDragging
        } ) }
        draggable = { isDragging }
        onDragEnd = { event => {
            setF ( false )
            if ( typeof onDragEnd === 'function' )
                onDragEnd ( event )
        } }
        { ...rest }
    >
        <div className = { styles.controls }>
            <button
                className = { cn ( styles.control, styles.addBlcok ) }
                children = '+'
            />
            <div
                className = { cn ( styles.control, styles.dragHandle ) }
                onMouseDown = { () => setF ( true ) }
                onMouseUp = { () => setF ( false ) }
                onDragEnd = { () => setF ( false ) }
                children = '='
            />
        </div>
        <div
            className = { styles.content }
            children = { children }
        />
    </div>
} )
export default BlockWrapper
