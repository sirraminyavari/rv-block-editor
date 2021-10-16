import { useEffect, useLayoutEffect, useRef, MutableRefObject } from 'react'
import { EditorState, RawDraftContentState } from 'draft-js'
import Editor from '@draft-js-plugins/editor'

import useUiContext, { UiContext } from 'BlockEditor/Contexts/UiContext'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'

import copyHandler from './copy'
import cutHandler from './cut'
import pasteHandler from './paste'


const rawHandlers = { copy: copyHandler, cut: cutHandler, paste: pasteHandler }

export type ClipboardEventHandler = (
    editor: Editor,
    getUiState: () => UiContext,
    setEditorState: SetState < EditorState >,
    event: ClipboardEvent
) => void

export interface ClipboardData {
    NEXTLE_blockEditor: boolean
    NEXTLE_blockEditor_BLS: boolean
    NEXTLE_blockEditor_version: number
    rawContent: RawDraftContentState
}

function registerClipboardHandlers (
    uiStateRef: MutableRefObject < UiContext >,
    setEditorState: SetState < EditorState >
): () => void {
    const editor = uiStateRef.current.editorRef.current
    const { editor: editorElemRef } = editor.getEditorRef ()
    const handlers = {}
    for ( const eventName in rawHandlers ) {
        handlers [ eventName ] = rawHandlers [ eventName ].bind ( null, editor, () => uiStateRef.current, setEditorState )
        editorElemRef.addEventListener ( eventName, handlers [ eventName ] )
    }
    return () => {
        for ( const eventName in handlers )
            editorElemRef.removeEventListener ( eventName, handlers [ eventName ] )
    }
}

export default function useClipboardHandlers () {
    const { setEditorState } = useEditorContext ()
    const uiState = useUiContext ()
    const uiStateRef = useRef ( uiState )
    useEffect ( () => { uiStateRef.current = uiState }, [ uiState ] )
    useLayoutEffect ( () => {
        const unregisterClipboardHandlers = registerClipboardHandlers ( uiStateRef, setEditorState )
        return unregisterClipboardHandlers
    }, [] )
}

export function handlePastedText ( _, html, _2 ) {
    if ( ! html ) return 'not-handled'
    const elem = document.createElement ( 'div' )
    elem.innerHTML = html
    const wrapperDiv = elem.querySelector ( 'div' )
    if ( ! wrapperDiv ) return 'not-handled'
    return wrapperDiv.getAttribute ( 'data-NEXTLE_blockEditor' ) && wrapperDiv.getAttribute ( 'data-NEXTLE_blockEditor_BLS' )
        ? 'handled' : 'not-handled'
}
