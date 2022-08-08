import { useEffect, useRef, useState } from 'react'
import { EditorState, BlockMap } from 'draft-js'

export interface Changes {
  updatedBlocks: BlockMap
  removedBlocks: BlockMap
  createdBlocks: BlockMap
}

export type onAutoSaveType = (changes: Changes) => void

export default function useAutoSave(
  editorState: EditorState,
  onAutoSave: onAutoSaveType,
  interval = 5000
) {
  const [isHot, setIsHot] = useState(false)
  const lastEditorState = useRef(editorState)
  const timer = useRef(null)

  function setTimer() {
    clearInterval(timer.current)
    timer.current = setTimeout(() => {
      setIsHot(true)
    }, interval)
  }

  useEffect(() => {
    setTimer()
    return () => clearInterval(timer.current)
  }, [])

  useEffect(() => {
    if (!isHot) return
    const { hasChanged, changes } = detectChanges(lastEditorState, editorState)
    if (!hasChanged) return
    onAutoSave(changes)
    lastEditorState.current = editorState
    setIsHot(false)
    setTimer()
  }, [editorState, isHot])
}

function detectChanges(lastEditorState, editorState) {
  const lastBlockMap = lastEditorState.current.getCurrentContent().getBlockMap()
  const newBlockMap = editorState.getCurrentContent().getBlockMap()

  const updatedBlocks = newBlockMap.filter((block, key) => {
    const oldBlock = lastBlockMap.get(key)
    if (!oldBlock) return false
    return !block.equals(oldBlock)
  }) as BlockMap
  const removedBlocks = lastBlockMap.filter(
    (_, key) => !newBlockMap.get(key)
  ) as BlockMap
  const createdBlocks = newBlockMap.filter(
    (_, key) => !lastBlockMap.get(key)
  ) as BlockMap

  return {
    hasChanged: updatedBlocks.size || removedBlocks.size || createdBlocks.size,
    changes: { updatedBlocks, removedBlocks, createdBlocks },
  }
}
