import { forwardRef, HTMLAttributes } from 'react'
import cn from 'classnames'
import { IconType } from 'react-icons'
import { motion } from 'framer-motion'

import styles from './styles.module.scss'


export interface ButtonProps extends HTMLAttributes < HTMLDivElement > {
    Icon?: IconType
    active?: boolean
    [ key: string ]: any
}

const Button = forwardRef < HTMLDivElement, ButtonProps > ( (
    { className, Icon, active, children, ...props }: any, ref
) => <motion.div
    ref = { ref }
    className = { cn ( styles.button, className, {
        [ styles.active ]: active
    } ) }
    onMouseDown = { e => e.preventDefault () }
    { ...props }
>
    { Icon && <Icon /> }
    { children && <span children = { children } /> }
</motion.div> )
export default Button
