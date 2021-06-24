import { FC } from 'react'
import { ContentBlock } from 'draft-js'
import { Menu } from '@headlessui/react'
import useEditorContext from 'BlockEditor/EditorContext'
import useUiContext from 'BlockEditor/UiContext'
import applyPlusAction from 'BlockEditor/lib/applyPlusAction'

import plusActions from './plusActions'

import styles from './styles.module.scss'


export interface PlusMenuProps {
    block: ContentBlock
}

const PlusMenu: FC < PlusMenuProps > = ({ block }) => {
    const { editorState, setEditorState } = useEditorContext ()
    const { editorRef } = useUiContext ()
    return <Menu as = 'div'>
        <Menu.Button as = 'div' className = { styles.btn }>+</Menu.Button>
        <Menu.Items className = { styles.plusMenu }>
            { plusActions.map ( ({ label, action }) => <Menu.Item as = 'label'
                key = { action }
                children = { label }
                onClick = { () => {
                    editorRef.current?.focus ()
                    setImmediate ( () => setEditorState ( applyPlusAction ( editorState, block, action ) ) )
                } }
            /> ) }
        </Menu.Items>
    </Menu>
}
export default PlusMenu
