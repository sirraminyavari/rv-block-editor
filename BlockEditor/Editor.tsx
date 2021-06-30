import { forwardRef } from 'react'

import Editor from '@draft-js-plugins/editor'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'
import blockRenderMap from './blockRenderMap'
import useKeyCommand from './useKeyCommand'
import customStyleMap from './customStyleMap'

import InlineStyleMenu from './InlineStyleMenu'
import PlusMenu from './PlusMenu'
import DragOverlay from './DragOverlay'


const _BlockEditor = forwardRef < Editor, any > ( ( { dir, lang, ...props }, ref ) => {
    const { editorState, setEditorState, plugins } = useEditorContext ()
    const { editorRef, wrapperRef, setPlusMenuInfo } = useUiContext ()

    const handleKeyCommand = useKeyCommand ()

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
                plugins = { plugins }
                handleKeyCommand = { handleKeyCommand }
                customStyleMap = { customStyleMap }
                blockRenderMap = { blockRenderMap }
                onEscape = { () => {
                    setPlusMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
                } }
                { ...props }
            />
            <InlineStyleMenu />
            <PlusMenu />
            <DragOverlay />
        </div>
    </div>
} )
export default _BlockEditor
