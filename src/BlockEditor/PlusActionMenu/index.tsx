import { useState, memo } from 'react'
import { usePopper } from 'react-popper'
import { AnimatePresence } from 'framer-motion'
import Scrollbar from 'react-perfect-scrollbar'

import Overlay from '../Ui/Overlay'
import useTransformedPluginsContext from '../Contexts/TransformedPlugins'
import useUiContext from '../Contexts/UiContext'

import PlusActionButton from './PlusActionButton'

import * as styles from './styles.module.scss'

/**
 * An overlay menu containing all the Plus Actions.
 * It appears whenever users clicks on the `PlusActionMenuButton`.
 */
export default function PlusActionMenu() {
    const { plusActions } = useTransformedPluginsContext()
    const {
        plusActionMenuInfo: { openedBlock },
        blockRefs,
        dir,
    } = useUiContext()
    return (
        <AnimatePresence
            children={
                !!openedBlock && (
                    <Popper
                        blockKey={openedBlock.getKey()}
                        plusActions={plusActions}
                        blockRefs={blockRefs}
                        dir={dir}
                    />
                )
            }
        />
    )
}

const Popper = memo(({ blockKey, plusActions, blockRefs, dir }: any) => {
    const targetRef = blockRefs.current[blockKey]
    const [pannelRef, setPannelRef] = useState<HTMLDivElement>(null)
    const popper = usePopper(targetRef?.querySelector('*'), pannelRef, {
        placement: `bottom-${{ ltr: 'start', rtl: 'end' }[dir]}` as any,
    })
    const c = popper.styles.popper.top === '0' ? 1 : -1
    return (
        <div
            className={styles.plusActionMenu}
            ref={setPannelRef}
            style={popper.styles.popper}
            {...popper.attributes.popper}>
            <Overlay
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                    initial: { opacity: 0 },
                    animate: {
                        opacity: 1,
                        transition: { duration: 0.5, staggerChildren: 0.05 },
                    },
                    exit: { opacity: 0, transition: { duration: 0.2 } },
                }}
                style={{
                    transform: `translateY( ${0.5 * c}rem )`,
                }}
                className={styles.overlay}>
                {/* @ts-expect-error */}
                <Scrollbar
                    className={styles.scroll}
                    options={{
                        wheelPropagation: false,
                        suppressScrollX: true,
                        scrollingThreshold: 400,
                    }}
                    children={plusActions.map(action => (
                        <PlusActionButton
                            key={action.action}
                            action={action}
                            blockKey={blockKey}
                        />
                    ))}
                />
            </Overlay>
        </div>
    )
})
