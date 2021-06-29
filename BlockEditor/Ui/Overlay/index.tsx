import { forwardRef, HTMLAttributes } from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'


export interface OverlayProps extends HTMLAttributes < HTMLDivElement > {}

const Overlay = forwardRef < HTMLDivElement, OverlayProps > ( ( { className, ...props }, ref ) => <div
    ref = { ref }
    className = { cn ( styles.overlay, className ) }
    { ...props }
/> )
export default Overlay
