import { forwardRef } from 'react'

import Editor from '@draft-js-plugins/editor'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'
import useKeyCommand from './useKeyCommand'
import useAllPlugins from './useAllPlugins'

import InlineStyleMenu from './InlineStyleMenu'
import PlusMenu from './PlusMenu'
import DragOverlay from './DragOverlay'


const _BlockEditor = forwardRef < Editor, any > ( ( { dir, lang, plugins, ...props }, ref ) => {
    const { editorState, setEditorState } = useEditorContext ()
    const { editorRef, wrapperRef } = useUiContext ()

    const handleKeyCommand = useKeyCommand ()
    const allPlugins = useAllPlugins ( plugins )

    return <div
        onClick = { () => editorRef.current?.focus () }
        dir = { dir } lang = { lang }
        style = {{ isolation: 'isolate' }}
    >
        <div
            ref = { wrapperRef }
            style = {{ position: 'relative' }}
        >
            <Editor
                ref = { r => {
                    editorRef.current = r
                    if ( ref ) typeof ref === 'function'
                        ? ref ( r )
                        : ref.current = r
                } }
                editorState = { editorState }
                onChange = { setEditorState }
                plugins = { allPlugins }
                // defaultKeyCommands // TODO:
                handleKeyCommand = { handleKeyCommand }
                defaultBlockRenderMap
                // defaultKeyBindings // TODO:
                { ...props }
            />
            <InlineStyleMenu />
            <PlusMenu />
            <DragOverlay />
        </div>
    </div>
} )
export default _BlockEditor
