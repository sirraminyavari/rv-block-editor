import { forwardRef, HTMLAttributes } from 'react'
import cn from 'classnames'

import styles from './styles.module.scss'


export interface ButtonProps extends HTMLAttributes < HTMLDivElement > {}

const Button = forwardRef < HTMLDivElement, ButtonProps > ( ( { className, ...props }, ref ) => <div
    ref = { ref }
    className = { cn ( styles.button, className ) }
    onMouseDown = { e => e.preventDefault () }
    { ...props }
/> )
export default Button
