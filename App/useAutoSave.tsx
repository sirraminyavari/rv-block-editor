import { useEffect, useRef } from 'react'
import { EditorState, BlockMap } from 'draft-js'


export type onAutoSaveType = ( arg: {
    updatedBlocks: BlockMap
    removedBlocks: BlockMap
    createdBlocks: BlockMap
} ) => void

export default function useAutoSave ( editorState: EditorState, onAutoSave: onAutoSaveType, inverval = 5000 ) {
    const lastTime = useRef ( Date.now () )
    const lastEditorState = useRef ( editorState )

    useEffect ( () => {
        if ( Date.now () - lastTime.current < inverval ) return

        const lastBlockMap = lastEditorState.current.getCurrentContent ().getBlockMap ()
        const newBlockMap = editorState.getCurrentContent ().getBlockMap ()

        const updatedBlocks = newBlockMap.filter ( ( block, key ) => ! block.equals ( lastBlockMap.get ( key ) ) ) as BlockMap
        // TODO: Performance Optimization
        const removedBlocks = lastBlockMap.filter ( ( _, key ) => ! newBlockMap.get ( key ) ) as BlockMap
        const createdBlocks = newBlockMap.filter ( ( _, key ) => ! lastBlockMap.get ( key ) ) as BlockMap

        console.log ( updatedBlocks.toKeyedSeq ().toArray () )
        if ( updatedBlocks.size || removedBlocks.size || createdBlocks.size )
            onAutoSave ({ updatedBlocks, removedBlocks, createdBlocks })

        lastTime.current = Date.now ()
        lastEditorState.current = editorState
    }, [ editorState ] )
}
