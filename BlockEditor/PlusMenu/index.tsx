import { FC, useState } from 'react'
import { Popover } from '@headlessui/react'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import applyPlusActionToSelection from 'BlockEditor/lib/applyPlusActionToSelection'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import insertEmptyBlockBelowAndFocus from 'BlockEditor/lib/insertEmptyBlockBelowAndFocus'
import { usePopper } from 'react-popper'

import plusActions from './plusActions'

import styles from './styles.module.scss'


export default function PlusMenu () {
    const { plusMenuInfo: { openedBlock } } = useUiContext ()
    if ( ! openedBlock ) return null
    return <Popper block = { openedBlock } />
}

function Popper ({ block }) {
    const { setPlusMenuInfo, blockRefs } = useUiContext ()
    const targetRef = blockRefs.current [ block.getKey () ]
    const [ pannelRef, setPannelRef ] = useState ( null )
    const popper = usePopper ( targetRef, pannelRef, { placement: 'bottom-start' } )
    return <Popover>
        <Popover.Panel static
            ref = { setPannelRef }
            className = { styles.plusMenu }
            style = { popper.styles.popper }
            { ...popper.attributes.popper }
            onClick = { () => setPlusMenuInfo ( prev => ({ ...prev, openedBlock: null }) ) }
        >
            { plusActions.map ( action => <ActionButton
                key = { action.action }
                action = { action }
            /> ) }
        </Popover.Panel>
    </Popover>
}


export interface PlusAction {
    label: string
    action: string
}

interface ActionButtonProps {
    action: PlusAction
}

const ActionButton: FC < ActionButtonProps > = ({ action: { action, label } }) => {
    const { editorState, setEditorState } = useEditorContext ()
    return <label
        key = { action }
        children = { label }
        onMouseDown = { e => e.preventDefault () }
        onClick = { () => setEditorState ( applyPlusActionToSelection ( editorState, action ) ) }
    />
}


export interface PlusMenuButtonProps {
    blockKey: string
}

export const PlusMenuButton: FC < PlusMenuButtonProps > = ({ blockKey }) => {
    const { editorState, setEditorState } = useEditorContext ()
    const block = editorState.getCurrentContent ().getBlockForKey ( blockKey )
    const { setPlusMenuInfo } = useUiContext ()
    return <div
        children = '+'
        className = { styles.btn }
        onMouseDown = { e => e.preventDefault () }
        onClick = { () => {
            if ( ! block.getText () ) // There is no text in the current block so we should update it's type inplace
                return setPlusMenuInfo ( prev => ({ ...prev, openedBlock: block }) )
            // There is some text in the current block so we should create a new block below it and set the plusAction type for the newly created block
            const { newEditorState, newContentBlock } = insertEmptyBlockBelowAndFocus ( editorState, block )
            setEditorState ( newEditorState )
            setPlusMenuInfo ( prev => ({ ...prev, openedBlock: newContentBlock }) )
        } }
    />
}
