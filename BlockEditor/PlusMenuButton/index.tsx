import { FC } from 'react'
import { ContentBlock } from 'draft-js'
import { Menu } from '@headlessui/react'
import useEditorContext from 'BlockEditor/EditorContext'
import useUiContext from 'BlockEditor/UiContext'
import applyPlusAction from 'BlockEditor/lib/applyPlusAction'

import styles from './styles.module.scss'


export interface PlusMenuProps {
    block: ContentBlock
}

const PlusMenu: FC < PlusMenuProps > = ({ block }) => {
    const { editorState, setEditorState } = useEditorContext ()
    const { editorRef } = useUiContext ()
    const getAction = plusAction => () => {
        editorRef.current?.focus ()
        setImmediate ( () => setEditorState ( applyPlusAction ( editorState, block, plusAction ) ) )
    }
    return <Menu as = 'div'>
        <Menu.Button as = 'div'>+</Menu.Button>
        <Menu.Items className = { styles.plusMenu }>
            <Menu.Item as = 'div' onClick = { getAction ( 'header-one' ) }>{ () => <label>Heading 1</label> }</Menu.Item>
            <Menu.Item as = 'div' onClick = { getAction ( 'header-two' ) }>{ () => <label>Heading 2</label> }</Menu.Item>
            <Menu.Item as = 'div' onClick = { getAction ( 'header-three' ) }>{ () => <label>Heading 3</label> }</Menu.Item>
        </Menu.Items>
    </Menu>
}
export default PlusMenu
