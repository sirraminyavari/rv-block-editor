import { FC } from 'react'
import { ContentBlock } from 'draft-js'
import { Popover } from '@headlessui/react'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import applyPlusAction from 'BlockEditor/Lib/applyPlusAction'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import plusActions from './plusActions'

import styles from './styles.module.scss'


export default function PlusMenu () {
    const { plusMenuInfo: { openedBlock }, blockRefs, wrapperRef } = useUiContext ()
    if ( ! openedBlock ) return null
    const targetRef = blockRefs.current [ openedBlock.getKey () ]
    const targetRect = targetRef.getBoundingClientRect ()
    const wrapperRect = wrapperRef.current.getBoundingClientRect ()
    return <Popover>
        <Popover.Panel static
            className = { styles.plusMenu }
            style = {{ // @ts-ignore
                '--x': targetRect.x - wrapperRect.x, '--y': targetRect.bottom - wrapperRect.y
            }}
        >
            { plusActions.map ( action => <ActionButton
                key = { action.action }
                action = { action }
                block = { openedBlock }
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
    block: ContentBlock
}

const ActionButton: FC < ActionButtonProps > = ({ action: { action, label }, block }) => {
    const { editorState, setEditorState } = useEditorContext ()
    return <label
        key = { action }
        children = { label }
        onMouseDown = { e => e.preventDefault () }
        onClick = { () => setEditorState ( applyPlusAction ( editorState, block, action ) ) }
    />
}


export interface PlusMenuButtonProps {
    block: ContentBlock
}

export const PlusMenuButton: FC < PlusMenuButtonProps > = ({ block }) => {
    const { setPlusMenuInfo } = useUiContext ()
    return <div
        children = '+'
        className = { styles.btn }
        onMouseDown = { e => e.preventDefault () }
        onClick = { () => {
            setPlusMenuInfo ( prev => ({ ...prev, openedBlock: block }) )
        } }
    />
}
