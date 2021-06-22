import { Editor } from 'draft-js'

import useEditorContext from './EditorContext'
import useUiContext from './UiContext'
import useBlockRendererFn from './useBlockRendererFn'
import useKeyCommand from './useKeyCommand'
import customStyleMap from './customStyleMap'

import DragOverlay from './DragOverlay'
import PlusMenu from './PlusMenu'
import Controls from './Controls'

import styles from './styles.module.scss'


export default function _BlockEditor () {
    const { editorState, setEditorState } = useEditorContext ()
    const { editorRef } = useUiContext ()

    const handleKeyCommand = useKeyCommand ()
    const blockRendererFn = useBlockRendererFn ()

    return <div onClick = { () => editorRef.current?.focus?.() }>
        <Controls />
        <div className = { styles.editorWrapper }>
            <Editor
                ref = { editorRef }
                editorState = { editorState }
                onChange = { setEditorState }
                handleKeyCommand = { handleKeyCommand }
                customStyleMap = { customStyleMap }
                blockRendererFn = { blockRendererFn }
            />
            <DragOverlay />
            <PlusMenu />
        </div>
    </div>
}
