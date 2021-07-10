import { forwardRef, useState, useLayoutEffect } from 'react'

import Editor, { PluginEditorProps } from '@draft-js-plugins/editor'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'
import TransformedPlugins from './Contexts/TransformedPlugins'

import BlockControls from './BlockControls'
import InlineStyleMenu from './InlineStyleMenu'
import PlusActionMenu from './PlusActionMenu'
import DragOverlay from './DragOverlay'


export interface BlockEditorProps extends Partial < PluginEditorProps > {}

/**
 * This is the most important component of the entire project and everything comes together in here.
 */
const BlockEditor = forwardRef < Editor, BlockEditorProps > ( ( props, ref ) => {
    const { editorState, setEditorState } = useEditorContext ()
    const { dir, lang, editorRef, wrapperRef, innerWrapperRef, externalStyles } = useUiContext ()
    const { allPlugins } = TransformedPlugins ()

    const [ renderRefDependentComps, setRenderRefDependentComps ] = useState ( false )
    useLayoutEffect ( () => setRenderRefDependentComps ( true ), [] )

    return <div data-block-editor-outer-wrapper
        ref = { wrapperRef }
        onClick = { () => editorRef.current?.focus () }
        className = { externalStyles.wrapper }
        style = {{ isolation: 'isolate', position: 'relative' }}
        dir = { dir } lang = { lang }
    >
        <div data-block-editor-inner-wrapper
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
        { renderRefDependentComps && <>
            <BlockControls />
            <InlineStyleMenu />
            <PlusActionMenu />
            <DragOverlay />
        </> }
    </div>
} )
export default BlockEditor
