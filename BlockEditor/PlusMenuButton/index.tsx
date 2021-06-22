// import { useState, useEffect } from 'react'
// import cn from 'classnames'
// import useUiContext from '../UiContext'
import { Menu } from '@headlessui/react'

import styles from './styles.module.scss'


export default function PlusMenu () {
    return <Menu as = 'div'>
        <Menu.Button as = 'div'>+</Menu.Button>
        <Menu.Items className = { styles.plusMenu }>
            <Menu.Item>{ () => <label>Heading 1</label> }</Menu.Item>
            <Menu.Item>{ () => <label>Heading 2</label> }</Menu.Item>
            <Menu.Item>{ () => <label>Heading 3</label> }</Menu.Item>
        </Menu.Items>
    </Menu>
}
