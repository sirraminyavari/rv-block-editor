import { forwardRef, HTMLAttributes } from 'react'
import cn from 'classnames'
import { IconType } from 'react-icons'
import { motion } from 'framer-motion'

import * as styles from './styles.module.scss'


export interface ButtonProps extends HTMLAttributes < HTMLDivElement > {
    Icon?: IconType
    active?: boolean
    motion?: boolean
    [ key: string ]: any
}

/**
 * Generic button UI element.
 */
const Button = forwardRef < HTMLDivElement, ButtonProps > ( (
    { className, Icon, active, motion, children, ...props }: any, ref
) => {
    // FIXME: BUG: motion name shadowing
    const Comp = motion ? motion.div : 'div'
    return <Comp
        ref = { ref }
        className = { cn ( styles.button, className, {
            [ styles.active ]: active
        } ) }
        onMouseDown = { e => e.preventDefault () }
        { ...props }
    >
        { Icon && <Icon /> }
        { children && <span children = { children } /> }
    </Comp>
} )
export default Button
