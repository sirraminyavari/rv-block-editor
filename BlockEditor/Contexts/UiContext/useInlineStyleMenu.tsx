import { SelectionState } from 'draft-js'


/**
 * Information regarding the Inline Style Menu UI.
 */
 export interface InlineStyleMenuInfo {
    /**
     * Whether the Inline Style Menu is open.
     */
    isOpen: boolean
    /**
     * The native selection object on witch the Inline Style Menu operate.
     */
    domSelection?: Selection
    /**
     * @returns The Bounding Rect of @param domSelection .
     */
    getSelectionRect?: () => DOMRect | null
}

export default function useInlineStyleMenu ( selectionState: SelectionState ): InlineStyleMenuInfo {
    try {
        const isOpen = selectionState.getHasFocus () && (
            selectionState.getAnchorKey () !== selectionState.getFocusKey () ||
            selectionState.getAnchorOffset () !== selectionState.getFocusOffset ()
        )
        const domSelection = isOpen ? window.getSelection () : null
        const getSelectionRect = () => domSelection?.getRangeAt ( 0 ).getBoundingClientRect ()
        return { isOpen, domSelection, getSelectionRect }
    } catch {
        return { isOpen: false, getSelectionRect: () => null }
    }
}
