import { FC } from 'react'
import { Menu } from '@headlessui/react'
import useEditorContext from 'BlockEditor/EditorContext'
import applyPlusAction from 'BlockEditor/lib/applyPlusAction'

import styles from './styles.module.scss'


export interface PlusMenuProps {
    blockKey: string
}

const PlusMenu: FC < PlusMenuProps > = ({ blockKey }) => {
    const { editorState, setEditorState } = useEditorContext ()
    return <Menu as = 'div'>
        <Menu.Button as = 'div'>+</Menu.Button>
        <Menu.Items className = { styles.plusMenu }>
            <Menu.Item onClick = { () => setEditorState ( applyPlusAction ( editorState, blockKey, 'header-one' ) ) }>{ () => <label>Heading 1</label> }</Menu.Item>
            <Menu.Item onClick = { () => setEditorState ( applyPlusAction ( editorState, blockKey, 'header-two' ) ) }>{ () => <label>Heading 2</label> }</Menu.Item>
            <Menu.Item onClick = { () => setEditorState ( applyPlusAction ( editorState, blockKey, 'header-three' ) ) }>{ () => <label>Heading 3</label> }</Menu.Item>
        </Menu.Items>
    </Menu>
}
export default PlusMenu
