import { Editor } from 'draft-js'

import useEditorContext from './EditorContext'
import useUiContext from './UiContext'
import blockRenderMap from './blockRenderMap'
import useKeyCommand from './useKeyCommand'
import customStyleMap from './customStyleMap'

import DragOverlay from './DragOverlay'
import Controls from './Controls'

import styles from './styles.module.scss'


export default function _BlockEditor () {
    const { editorState, setEditorState } = useEditorContext ()
    const { editorRef } = useUiContext ()

    const handleKeyCommand = useKeyCommand ()

    return <div onClick = { () => editorRef.current?.focus?.() }>
        <Controls />
        <div className = { styles.editorWrapper }>
            <Editor
                ref = { editorRef }
                editorState = { editorState }
                onChange = { setEditorState }
                handleKeyCommand = { handleKeyCommand }
                customStyleMap = { customStyleMap }
                blockRenderMap = { blockRenderMap }
            />
            <DragOverlay />
        </div>
    </div>
}
