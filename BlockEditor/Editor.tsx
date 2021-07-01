import { forwardRef } from 'react'
import { language, direction } from 'BlockEditor'

import Editor, { PluginEditorProps } from '@draft-js-plugins/editor'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'
import useAllPlugins from './useAllPlugins'

import InlineStyleMenu from './InlineStyleMenu'
import PlusMenu from './PlusMenu'
import DragOverlay from './DragOverlay'


export interface BlockEditorProps extends Partial < PluginEditorProps > {
    dir: direction
    lang: language
}

const BlockEditor = forwardRef < Editor, BlockEditorProps > ( ( { dir, lang, plugins, ...props }, ref ) => {
    const { editorState, setEditorState } = useEditorContext ()
    const { editorRef, wrapperRef, externalStyles } = useUiContext ()
    const allPlugins = useAllPlugins ( plugins )

    return <div
        ref = { wrapperRef }
        onClick = { () => editorRef.current?.focus () }
        className = { externalStyles.wrapper }
        style = {{ isolation: 'isolate', position: 'relative' }}
        dir = { dir } lang = { lang }
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
            defaultBlockRenderMap
            defaultKeyBindings
            defaultKeyCommands
            { ...props }
        />
        <InlineStyleMenu />
        <PlusMenu />
        <DragOverlay />
    </div>
} )
export default BlockEditor
