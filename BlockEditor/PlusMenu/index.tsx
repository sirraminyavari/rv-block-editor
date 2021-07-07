import { FC, useState } from 'react'
import { ContentBlock } from 'draft-js'
import { Popover } from '@headlessui/react'
import { usePopper } from 'react-popper'
import Overlay from 'BlockEditor/Ui/Overlay'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import applyPlusActionToSelection from 'BlockEditor/Lib/applyPlusActionToSelection'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import { PlusAction } from 'BlockEditor'

import styles from './styles.module.scss'


export default function PlusMenu () {
    const { plusMenuInfo: { openedBlock } } = useUiContext ()
    if ( ! openedBlock ) return null
    return <Popper block = { openedBlock } />
}

function Popper ({ block }) {
    const { plusActions }  = useEditorContext ()
    const { blockRefs, dir } = useUiContext ()
    const targetRef = blockRefs.current [ block.getKey () ]
    const [ pannelRef, setPannelRef ] = useState < HTMLDivElement > ( null )
    const popper = usePopper (
        targetRef?.querySelector ( '*' ), pannelRef,
        { placement: `bottom-${ { ltr: 'start', rtl: 'end' } [ dir ] }` as any }
    )
    return <Popover>
        <Popover.Panel static as = { Overlay }
            ref = { setPannelRef }
            style = { popper.styles.popper }
            { ...popper.attributes.popper }
        >
            <div
                className = { styles.plusMenu }
                children = { plusActions.map ( action => <ActionButton
                    key = { action.action }
                    action = { action }
                    block = { block }
                /> ) }
            />
        </Popover.Panel>
    </Popover>
}


interface ActionButtonProps {
    action: PlusAction
    block: ContentBlock
}

const ActionButton: FC < ActionButtonProps > = ({ action: { action, Icon, label }, block }) => {
    const { editorState, setEditorState } = useEditorContext ()
    const { blockRefs, setBlockControlsInfo, setPlusMenuInfo } = useUiContext ()
    return <label
        key = { action }
        className = { styles.actionButton }
        onMouseDown = { e => e.preventDefault () }
        onClick = { () => {
            setPlusMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
            setEditorState ( applyPlusActionToSelection ( editorState, action ) )
            const blockKey = block.getKey ()
            setImmediate ( () => setBlockControlsInfo ( prev => ({ ...prev,
                hoveredBlockKey: blockKey,
                hoveredBlockElem: blockRefs.current [ blockKey ]
            }) ) )
        } }
    >
        <div className = { styles.iconWrapper }>
            <Icon />
        </div>
        <span className = { styles.label } children = { label } />
    </label>
}
