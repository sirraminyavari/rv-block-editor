import { forwardRef, useState, useLayoutEffect, useMemo, useEffect, useCallback } from 'react'
import cn from 'classnames'
import _ from 'lodash'

import { EditorState } from 'draft-js'
import Editor, { PluginEditorProps } from '@draft-js-plugins/editor'
import MultiDecorator from './Utils/MultiDecorator'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'
import useTransformedPluginsContext from './Contexts/TransformedPlugins'

import BlockControls from './BlockControls'
import InlineStyleMenu from './InlineStyleMenu'
import PlusActionMenu from './PlusActionMenu'
import DragOverlay from './DnD'
import useClipboardHandlers, { handlePastedText } from './Clipboard'

import { StateTransformer } from './types'
import * as styles from './internalStyles.module.scss'

export interface BlockEditorProps extends Partial<PluginEditorProps> {}

/**
 * This is the most important component of the entire project and everything comes together in here.
 */
const BlockEditor = forwardRef<Editor, BlockEditorProps>((props, ref) => {
    const { editorState, setEditorState } = useEditorContext()
    const {
        dir,
        lang,
        externalStyles,
        editorRef,
        wrapperRef,
        innerWrapperRef,
        blockLevelSelectionInfo,
        debugMode,
        textarea,
        readOnly,
    } = useUiContext()
    const { allPlugins, PluginsOverlay } = useTransformedPluginsContext()

    const [renderRefDependentComps, setRenderRefDependentComps] = useState(false)
    useLayoutEffect(() => setRenderRefDependentComps(true), [])

    useClipboardHandlers()

    // This is a hack that needs to be done otherwise no plugin decorator will work.
    const decorator = useMemo(() => {
        return new MultiDecorator(
            allPlugins
                .map(p => p.decorators)
                .filter(Boolean)
                .reduce((acc, val) => [...acc, ...val], [])
        )
    }, [allPlugins])
    useEffect(() => {
        setEditorState(EditorState.set(editorState, { decorator }))
    }, [decorator])
    const allPluginsWithoutDecorators = useMemo(() => allPlugins.map(p => _.omit(p, ['decorators'])), [allPlugins])

    const getEditorRef = useCallback(
        r => {
            editorRef.current = r
            if (ref) typeof ref === 'function' ? ref(r) : (ref.current = r)
        },
        [ref]
    )

    const disableOnBls = useCallback(
        () => (blockLevelSelectionInfo.enabled ? 'handled' : 'not-handled'),
        [blockLevelSelectionInfo.enabled]
    )

    const renderEditor = useMemo(
        () => (
            //@ts-expect-error
            <Editor
                ref={getEditorRef}
                editorState={editorState}
                readOnly={readOnly}
                onChange={setEditorState}
                plugins={allPluginsWithoutDecorators}
                defaultBlockRenderMap
                defaultKeyBindings
                defaultKeyCommands
                handleBeforeInput={disableOnBls}
                handlePastedText={handlePastedText}
                {...props}
            />
        ),
        [
            editorState,
            allPluginsWithoutDecorators,
            readOnly,
            getEditorRef,
            disableOnBls,
            handlePastedText,
            props.onFocus,
            props,
        ]
    )

    return (
        <div
            data-block-editor-outer-wrapper
            ref={wrapperRef}
            onMouseDown={() => editorRef.current?.focus()}
            onClick={() => editorRef.current?.focus()}
            className={cn(externalStyles.wrapper, {
                [externalStyles.blockLevelSelection]: blockLevelSelectionInfo.enabled,
                [styles.blockLevelSelectionHideRealSelection]: blockLevelSelectionInfo.enabled && !debugMode,
            })}
            style={{ isolation: 'isolate', position: 'relative' }}
            dir={dir}
            lang={lang}>
            <div
                data-block-editor-inner-wrapper
                ref={innerWrapperRef}
                className={externalStyles.innerWrapper}
                {...(blockLevelSelectionInfo.enabled ? { onDragStart: e => e.preventDefault() } : null)}>
                {renderEditor}
            </div>
            {!readOnly && renderRefDependentComps && (
                <>
                    {textarea || <BlockControls />}
                    <InlineStyleMenu />
                    {textarea || (
                        <>
                            <PlusActionMenu />
                            <DragOverlay />
                        </>
                    )}
                    {/* @ts-expect-error */}
                    <PluginsOverlay />
                </>
            )}
        </div>
    )
})
export default BlockEditor
