import { FC } from 'react'
import { ContentBlock } from 'draft-js'
import { Popover } from '@headlessui/react'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import applyPlusAction from 'BlockEditor/Lib/applyPlusAction'

import plusActions from './plusActions'

import styles from './styles.module.scss'


export interface PlusMenuProps {
    block: ContentBlock
}

const PlusMenu: FC < PlusMenuProps > = ({ block }) => {
    const { editorState, setEditorState } = useEditorContext ()
    return <Popover as = 'div'>
        <Popover.Button as = 'div' className = { styles.btn } children = '+' onMouseDown = { e => e.preventDefault () } />
        <Popover.Panel className = { styles.plusMenu }>
            { plusActions.map ( ({ label, action }) => <label
                key = { action }
                children = { label }
                onMouseDown = { e => e.preventDefault () }
                onClick = { () => setEditorState ( applyPlusAction ( editorState, block, action ) ) }
            /> ) }
        </Popover.Panel>
    </Popover>
}
export default PlusMenu
