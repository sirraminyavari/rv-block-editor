import 'draft-js/dist/Draft.css'
import { FC } from 'react'
import { Editor } from 'draft-js'

import useEditorContext, { EditorContextProvider } from './EditorContext'
import useBlockRendererFn from './useBlockRendererFn'
import useKeyCommand from './useKeyCommand'
import customStyleMap from './customStyleMap'

import DragOverlay from './DragOverlay'
import Controls from './Controls'

import styles from './styles.module.scss'


const BlockEditor: FC < any > = ({ editorState, setEditorState, props }) => {
    return <EditorContextProvider editorState = { editorState } setEditorState = { setEditorState }>
        <_BlockEditor { ...props } />
    </EditorContextProvider>
}
export default BlockEditor

function _BlockEditor () {
    const { editorState, setEditorState, editorRef } = useEditorContext ()

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
        </div>
    </div>
}
