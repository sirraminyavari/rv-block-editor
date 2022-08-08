import { useState, useLayoutEffect, useRef, MutableRefObject, useCallback } from 'react'
import { EditorState } from 'draft-js'

import { BlockRefs } from './useGlobalRefs'

/**
 * Information regarding the Block Controls UI.
 */
export interface BlockControlsInfo {
    // Indicates which block we need to display the Block Controls UI on
    hoveredBlockKey?: string
    // Reference to the block on which the Block Controls UI needs to render
    hoveredBlockElem?: HTMLDivElement
}

export default function useBlockControls(
    editorState: EditorState,
    wrapperRef: MutableRefObject<HTMLDivElement>,
    blockRefs: BlockRefs,
    disable: boolean
): [BlockControlsInfo, SetState<BlockControlsInfo>] {
    const [blockControlsInfo, setBlockControlsInfo] = useState<BlockControlsInfo>()

    useLayoutEffect(() => {
        // Set Block Controls on the first block initialy
        if (disable) return
        const firstBlockElem = wrapperRef.current.querySelector('[data-block-key]') as HTMLDivElement
        setBlockControlsInfo(prev => ({
            ...prev,
            hoveredBlockElem: firstBlockElem,
            hoveredBlockKey: firstBlockElem.getAttribute('data-block-key'),
        }))
    }, [disable])

    const mouseY = useRef(0)
    const positionBlockControls = useCallback(({ clientY: y }) => {
        mouseY.current = y
        const hoveredBlockElem: HTMLDivElement | null = (() => {
            const blocks = Object.values(blockRefs.current).filter(Boolean)
            for (const block of blocks) {
                const rect = block.getBoundingClientRect()
                if (rect.y <= y && rect.bottom >= y) return block
            }
            return null
        })()
        if (!hoveredBlockElem)
            return setBlockControlsInfo(prev => ({
                ...prev,
                hoveredBlockElem: blockRefs.current[prev.hoveredBlockKey],
            }))
        const hoveredBlockKey = hoveredBlockElem.getAttribute('data-block-key')
        setBlockControlsInfo(prev =>
            prev.hoveredBlockElem === hoveredBlockElem && prev.hoveredBlockKey === hoveredBlockKey
                ? prev
                : { ...prev, hoveredBlockElem, hoveredBlockKey }
        )
    }, [])

    useLayoutEffect(() => {
        if (disable) return
        document.addEventListener('mousemove', positionBlockControls)
        const observer = new MutationObserver(() => setBlockControlsInfo(prev => ({ ...prev })))
        observer.observe(wrapperRef.current, {
            attributes: true,
            childList: true,
            subtree: true,
        })
        return () => {
            document.removeEventListener('mousemove', positionBlockControls)
            observer.disconnect()
        }
    }, [disable])

    useLayoutEffect(() => {
        if (disable) return
        positionBlockControls({ clientY: mouseY.current })
    }, [disable, editorState])

    return [blockControlsInfo, setBlockControlsInfo]
}
