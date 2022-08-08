import { useRef, MutableRefObject } from 'react'
import Editor from '@draft-js-plugins/editor'

export type EditorRef = MutableRefObject<Editor>

export type WrapperRef = MutableRefObject<HTMLDivElement>

/**
 * Refs to wrappers of all Content Blocks.
 * * Caveat: The refs of deleted blocks will be nulled. Always use `.filter ( Boolean )` or something.
 */
export type BlockRefs = MutableRefObject<{
  [key: string]: HTMLDivElement | null
}>

export interface GlobalRefs {
  editorRef: EditorRef
  wrapperRef: WrapperRef
  innerWrapperRef: WrapperRef
  blockRefs: BlockRefs
}

export default function useGlobalRefs(): GlobalRefs {
  const editorRef = useRef<Editor>()
  const wrapperRef = useRef<HTMLDivElement>()
  const innerWrapperRef = useRef<HTMLDivElement>()
  const blockRefs: BlockRefs = useRef({})
  return { editorRef, wrapperRef, innerWrapperRef, blockRefs }
}
