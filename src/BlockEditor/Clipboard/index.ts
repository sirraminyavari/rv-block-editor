import { useEffect, useLayoutEffect, useRef, MutableRefObject } from 'react'
import { EditorState, RawDraftContentState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import tableLib from 'Plugins/Table/lib'

import useUiContext, { UiContext } from '../Contexts/UiContext'
import useEditorContext from '../Contexts/EditorContext'

import copyHandler from './copy'
import cutHandler from './cut'
import pasteHandler from './paste'

const rawHandlers = { copy: copyHandler, cut: cutHandler, paste: pasteHandler }

export type ClipboardEventHandler = (
    editor: Editor,
    getUiState: () => UiContext,
    setEditorState: SetState<EditorState>,
    event: ClipboardEvent
) => void

export interface ClipboardData {
    // Whether the data has originally been copied from an instance of our editor
    NEXTLE_blockEditor: boolean
    // Whether the copied data consists of multiple blocks (BLS) or a single block
    NEXTLE_blockEditor_BLS: boolean
    // The version of the editor which the data has been copied from
    NEXTLE_blockEditor_version: number
    // Raw content state of the copied fragment
    rawContent: RawDraftContentState
}

/**
 * Registers all clipboard handlers and provides them with required utilities.
 */
function registerClipboardHandlers(
    uiStateRef: MutableRefObject<UiContext>,
    setEditorState: SetState<EditorState>
): () => void {
    const editor = uiStateRef.current.editorRef.current
    const getUiState = () => uiStateRef.current
    const { editor: editorElemRef } = editor.getEditorRef()
    const handlers = {}
    for (const eventName in rawHandlers) {
        handlers[eventName] = rawHandlers[eventName].bind(
            null,
            editor,
            getUiState,
            setEditorState
        )
        editorElemRef.addEventListener(eventName, handlers[eventName])
    }
    return () => {
        for (const eventName in handlers)
            editorElemRef.removeEventListener(eventName, handlers[eventName])
    }
}

/**
 * A simple way to use 'registerClipboardHandlers' without the need to
 * provide any argument.
 * All the necessary data will be retrieved using hooks.
 */
export default function useClipboardHandlers() {
    const { setEditorState } = useEditorContext()
    const uiState = useUiContext()
    const uiStateRef = useRef(uiState)
    useEffect(() => {
        uiStateRef.current = uiState
    }, [uiState])
    useLayoutEffect(() => {
        const unregisterClipboardHandlers = registerClipboardHandlers(
            uiStateRef,
            setEditorState
        )
        return unregisterClipboardHandlers
    }, [])
}

/**
 * This method tells Draft.js whether to use its own pasing logic or delegate
 * the paste operation to our custom clipboard handler.
 */
export function handlePastedText(text, html, editorState, { setEditorState }) {
    // if ( tableLib.isTableText ( text ) ) // FIXME: Spaghetti
    //     return 'not-handled'
    // return 'not-handled'
    if (!html) return 'not-handled'
    const elem = document.createElement('div')
    elem.innerHTML = html
    const wrapperDiv = elem.querySelector('div')
    if (!wrapperDiv) return 'not-handled'
    return wrapperDiv.getAttribute('data-NEXTLE_blockEditor') &&
        wrapperDiv.getAttribute('data-NEXTLE_blockEditor_BLS')
        ? 'handled'
        : 'not-handled'
}
