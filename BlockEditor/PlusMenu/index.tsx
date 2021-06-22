import { useState, useEffect } from 'react'
import cn from 'classnames'
import useUiContext from '../UiContext'

import styles from './styles.module.scss'


export default function PlusMenu () {
    const { plusMenuInfo: { isOpen, anchor } } = useUiContext ()
    const [ anchorRect, setAnchorRect ] = useState ( null )
    useEffect ( () => {
        if ( ! isOpen )
            return setAnchorRect ( null )
        setAnchorRect ( anchor.getBoundingClientRect () )
    }, [ isOpen ] )
    return <div
        className = { cn ( styles.plusMenu, { [ styles.open ]: isOpen } ) }
        style = {{ top: anchorRect?.y, left: anchorRect?.x }}
    >
        <ul>
            <li>Heading 1</li>
            <li>Heading 2</li>
            <li>Heading 3</li>
        </ul>
    </div>
}
