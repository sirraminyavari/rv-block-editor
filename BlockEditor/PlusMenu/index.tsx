import { FC } from 'react'
import { ContentBlock } from 'draft-js'
import { Popover } from '@headlessui/react'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import applyPlusActionToSelection from 'BlockEditor/Lib/applyPlusActionToSelection'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import insertEmptyBlockBelowAndFocus from 'BlockEditor/Lib/insertEmptyBlockBelowAndFocus'

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
        onClick = { () => setEditorState ( applyPlusActionToSelection ( editorState, action ) ) }
    />
}


export interface PlusMenuButtonProps {
    block: ContentBlock
}

export const PlusMenuButton: FC < PlusMenuButtonProps > = ({ block }) => {
    const { editorState, setEditorState } = useEditorContext ()
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
            setImmediate ( () => setPlusMenuInfo ( prev => ({ ...prev, openedBlock: newContentBlock }) ) )
        } }
    />
}
