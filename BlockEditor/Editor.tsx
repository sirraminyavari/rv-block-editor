import { forwardRef, useState, useLayoutEffect } from 'react'
import { language, direction } from 'BlockEditor'

import Editor, { PluginEditorProps } from '@draft-js-plugins/editor'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'
import useAllPlugins from './useAllPlugins'

import BlockControls from './BlockControls'
import InlineStyleMenu from './InlineStyleMenu'
import PlusMenu from './PlusMenu'
import DragOverlay from './DragOverlay'


export interface BlockEditorProps extends Partial < PluginEditorProps > {
    dir: direction
    lang: language
}

const BlockEditor = forwardRef < Editor, BlockEditorProps > ( ( { dir, lang, plugins, ...props }, ref ) => {
    const { editorState, setEditorState } = useEditorContext ()
    const { editorRef, wrapperRef, innerWrapperRef, externalStyles, setBlockControlsInfo } = useUiContext ()
    const allPlugins = useAllPlugins ( plugins )

    const [ showRefDependentComps, setShowRefDependentComps ] = useState ( false )
    useLayoutEffect ( () => setShowRefDependentComps ( true ), [] )

    return <div
        ref = { wrapperRef }
        onClick = { () => editorRef.current?.focus () }
        className = { externalStyles.wrapper }
        style = {{ isolation: 'isolate', position: 'relative' }}
        dir = { dir } lang = { lang }
        onMouseEnter = { () => setBlockControlsInfo ( prev => ({ ...prev, isMouseOnEditor: true  }) ) }
        onMouseLeave = { () => setBlockControlsInfo ( prev => ({ ...prev, isMouseOnEditor: false }) ) }
    >
        <div
            ref = { innerWrapperRef }
            className = { externalStyles.innerWrapper }
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
        </div>
        { showRefDependentComps && <>
            <BlockControls />
            <InlineStyleMenu />
            <PlusMenu />
            <DragOverlay />
        </> }
    </div>
} )
export default BlockEditor
