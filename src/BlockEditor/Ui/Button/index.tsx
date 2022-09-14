import { forwardRef, HTMLAttributes } from 'react'
import cn from 'classnames'
import _ from 'lodash'
import { IconType } from 'react-icons'
import { motion } from 'framer-motion'

import * as styles from './styles.module.scss'

export interface ButtonProps extends HTMLAttributes<HTMLDivElement> {
    Icon?: IconType
    active?: boolean
    motion?: boolean
    disabled?: boolean
    [key: string]: any
}

/**
 * Generic button UI element.
 */
const Button = forwardRef<HTMLDivElement, ButtonProps>(
    ({ className, Icon, active, motion: useMotion, disabled, children, ...props }, ref) => {
        const Comp = useMotion ? motion.div : 'div'
        return (
            <Comp
                ref={ref}
                className={cn(styles.button, className, {
                    [styles.active]: active,
                    [styles.disabled]: disabled,
                })}
                onMouseDown={e => e.preventDefault()}
                {...(_.omit(props, disabled ? 'onClick' : '') as any)}>
                {Icon && <Icon />}
                {children && <span children={children} />}
            </Comp>
        )
    }
)
export default Button
