import { useCallback } from 'react'
import { RichUtils } from 'draft-js'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'


export default function useKeyCommand () {
    const { setEditorState } = useEditorContext ()
    return useCallback ( ( command, state ) => {
        const newState = RichUtils.handleKeyCommand ( state, command )
        if ( newState ) {
            setEditorState ( newState )
            return 'handled'
        }
        return 'not-handled'
    }, [ setEditorState ] )
}
