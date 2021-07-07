import { forwardRef, HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import cn from 'classnames'

import styles from './styles.module.scss'


export interface OverlayProps extends HTMLAttributes < HTMLDivElement > {
    [ key: string ]: any
}

const Overlay = forwardRef < HTMLDivElement, OverlayProps > ( ( { className, ...props }: any, ref ) => <motion.div
    ref = { ref }
    className = { cn ( styles.overlay, className ) }
    { ...props }
/> )
export default Overlay
