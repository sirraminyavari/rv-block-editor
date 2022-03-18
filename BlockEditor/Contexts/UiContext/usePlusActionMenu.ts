import { useState, useEffect } from 'react'
import { ContentBlock, SelectionState } from 'draft-js'


/**
 * Information regarding the Plus Menu UI.
 */
 export interface PlusActionMenuInfo {
    // Determines wich block has its Plus Menu currently openned
    openedBlock?: ContentBlock
}

/**
 * Handles the opening and closing of plus-action menu.
 */
export default function usePlusActionMenu (
    selectionState: SelectionState,
    disable: boolean
): [ PlusActionMenuInfo, SetState < PlusActionMenuInfo > ] {
    const [ plusActionMenuInfo, setPlusActionMenuInfo ] = useState < PlusActionMenuInfo > ({})

    useEffect ( () => {
        if ( disable ) return
        if ( plusActionMenuInfo.openedBlock && (
            ! selectionState.getHasFocus () ||
            plusActionMenuInfo.openedBlock.getKey () !== selectionState.getAnchorKey () ||
            plusActionMenuInfo.openedBlock.getKey () !== selectionState.getFocusKey  () ||
            selectionState.getAnchorOffset () !== 0 ||
            selectionState.getAnchorOffset () !== selectionState.getFocusOffset ()
        ) ) setPlusActionMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
    }, [ disable, plusActionMenuInfo, selectionState ] )

    return [ plusActionMenuInfo, setPlusActionMenuInfo ]
}
