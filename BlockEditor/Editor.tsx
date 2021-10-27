import { forwardRef, useState, useLayoutEffect, useMemo, useEffect } from 'react'
import cn from 'classnames'

import Editor, { PluginEditorProps } from '@draft-js-plugins/editor'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'
import useTransformedPluginsContext from './Contexts/TransformedPlugins'

import BlockControls from './BlockControls'
import InlineStyleMenu from './InlineStyleMenu'
import PlusActionMenu from './PlusActionMenu'
import DragOverlay from './DnD'

import useClipboardHandlers, { handlePastedText } from './Clipboard'
import { CompositeDecorator, EditorState } from 'draft-js'

import styles from './internalStyles.module.scss'


export interface BlockEditorProps extends Partial < PluginEditorProps > {}

/**
 * This is the most important component of the entire project and everything comes together in here.
 */
const BlockEditor = forwardRef < Editor, BlockEditorProps > ( ( { readOnly, ...props }, ref ) => {
    const { editorState, setEditorState } = useEditorContext ()
    const {
        dir, lang, externalStyles,
        editorRef, wrapperRef, innerWrapperRef,
        blockLevelSelectionInfo, debugMode, textarea
    } = useUiContext ()
    const { allPlugins } = useTransformedPluginsContext ()

    const [ renderRefDependentComps, setRenderRefDependentComps ] = useState ( false )
    useLayoutEffect ( () => setRenderRefDependentComps ( true ), [] )

    useClipboardHandlers ()

    // This is a hack that needs to be done otherwise no plugin decorator will work.
    const decorators = useMemo ( () => {
        return new CompositeDecorator ( allPlugins
            .map ( p => p.decorators )
            .filter ( Boolean )
            .reduce ( ( acc, val ) => [ ...acc, ...val ], [] ) as any
        )
    }, [ allPlugins ] )
    useEffect ( () => {
        setEditorState ( EditorState.set ( editorState, { decorator: decorators } ) )
    }, [ decorators ] )

    return <div data-block-editor-outer-wrapper
        ref = { wrapperRef }
        onMouseDown = { () => editorRef.current?.focus () }
        onClick = { () => editorRef.current?.focus () }
        className = { cn ( externalStyles.wrapper, {
            [ externalStyles.blockLevelSelection ]: blockLevelSelectionInfo.enabled,
            [ styles.blockLevelSelectionHideRealSelection ]: blockLevelSelectionInfo.enabled && ! debugMode
        } ) }
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
                readOnly = { readOnly }
                handleBeforeInput = { () => blockLevelSelectionInfo.enabled ? 'handled' : 'not-handled' }
                handlePastedText = { handlePastedText }
                { ...props }
            />
        </div>
        { ! readOnly && renderRefDependentComps && <>
            { textarea || <BlockControls /> }
            <InlineStyleMenu />
            { textarea || <>
                <PlusActionMenu />
                <DragOverlay />
            </> }
        </> }
    </div>
} )
export default BlockEditor
