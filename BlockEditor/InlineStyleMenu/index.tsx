import { FC } from 'react'
import { RichUtils } from 'draft-js'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import inlineStyles from './inlineStyles'

import styles from './styles.module.scss'


const InlineStyleMenu: FC = () => {
    const { editorState, setEditorState } = useEditorContext ()
    const { inlineStyleMenuInfo: { isOpen, selectionRect }, wrapperRef } = useUiContext ()
    if ( ! isOpen ) return null
    const wrapperRect = wrapperRef.current.getBoundingClientRect ()
    return <div
        className = { styles.inlineStyleMenu }
        // @ts-ignore
        style = {{ '--x': selectionRect.x - wrapperRect.x, '--y': selectionRect.y - wrapperRect.y }}
    >
        { inlineStyles.map ( ({ label, style }) => <button
            key = { style }
            children = { label }
            onMouseDown = { e => e.preventDefault () }
            onClick = { () => {
                const newEditorState = RichUtils.toggleInlineStyle ( editorState, style )
                setEditorState ( newEditorState )
            } }
        /> ) }
    </div>
}
export default InlineStyleMenu
