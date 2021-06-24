import { Editor } from 'draft-js'

import useEditorContext from './EditorContext'
import useUiContext from './UiContext'
import blockRenderMap from './blockRenderMap'
import useKeyCommand from './useKeyCommand'
import customStyleMap from './customStyleMap'

import Controls from './Controls'
import InlineStyleMenu from './InlineStyleMenu'
import DragOverlay from './DragOverlay'

import styles from './styles.module.scss'


export default function _BlockEditor () {
    const { editorState, setEditorState } = useEditorContext ()
    const { editorRef, wrapperRef } = useUiContext ()

    const handleKeyCommand = useKeyCommand ()

    return <div onClick = { () => editorRef.current?.focus () }>
        <Controls />
        <div className = { styles.editorWrapper } ref = { wrapperRef }>
            <Editor
                ref = { editorRef }
                editorState = { editorState }
                onChange = { setEditorState }
                handleKeyCommand = { handleKeyCommand }
                customStyleMap = { customStyleMap }
                blockRenderMap = { blockRenderMap }
            />
            <InlineStyleMenu />
            <DragOverlay />
        </div>
    </div>
}
