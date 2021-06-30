import { forwardRef, useMemo } from 'react'

import Editor from '@draft-js-plugins/editor'

import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'
import useKeyCommand from './useKeyCommand'
import customStyleMap from './customStyleMap'

import InlineStyleMenu from './InlineStyleMenu'
import PlusMenu from './PlusMenu'
import DragOverlay from './DragOverlay'


const _BlockEditor = forwardRef < Editor, any > ( ( { dir, lang, plugins, ...props }, ref ) => {
    const { editorState, setEditorState, plusActions } = useEditorContext ()
    const { editorRef, wrapperRef, setPlusMenuInfo } = useUiContext ()

    const handleKeyCommand = useKeyCommand ()

    const internalPlugins = useMemo ( () => {
        const blockBreakoutPlugin = createBlockBreakoutPlugin ({
            breakoutBlocks: plusActions.filter ( pa => pa.returnBreakout ).map ( pa => pa.action ),
            doubleBreakoutBlocks: plusActions.filter ( pa => pa.doubleBreakout ).map ( pa => pa.action )
        })
        const uiHandlerPlugin = {
            keyBindingFn ( event ) {
                console.log ( event )
                if ( event.key === 'Escape' )
                    setPlusMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
            }
        }
        return [ blockBreakoutPlugin, uiHandlerPlugin ]
    }, [] )
    const allPlugins = useMemo ( () => [ ...plugins, ...internalPlugins ], [ plugins, internalPlugins ] )

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
                customStyleMap = { customStyleMap }
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
