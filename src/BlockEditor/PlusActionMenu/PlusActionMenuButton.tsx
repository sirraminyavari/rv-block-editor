import { FC } from 'react'

import useEditorContext from '../Contexts/EditorContext'
import useUiContext from '../Contexts/UiContext'
import nestAwareInsertEmptyBlockBelowAndFocus from '../Lib/nestAwareInsertEmptyBlockBelowAndFocus'
import forceSelectionToBlock from '../Lib/forceSelectionToBlock'
import Button from '../Ui/Button'
import { PlusIcon } from '../icons'

import * as styles from './styles.module.scss'

export interface PlusActionMenuButtonProps {
  blockKey: string
}

/**
 * Opens the `PlusActionMenu` on the current Content Block if it's empty. Otherwise creates a new empty block below and opens the said menu on that.
 */
const PlusActionMenuButton: FC<PlusActionMenuButtonProps> = ({ blockKey }) => {
  const { editorState, setEditorState } = useEditorContext()
  const block = editorState.getCurrentContent().getBlockForKey(blockKey)
  const { setPlusActionMenuInfo } = useUiContext()
  return (
    <Button
      Icon={PlusIcon}
      className={styles.btn}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => {
        if (block.getText()) {
          // There is some text in the current block so we should create a new block below it and set the Plus Action type for the newly created block
          const { newEditorState, newContentBlock } =
            nestAwareInsertEmptyBlockBelowAndFocus(
              editorState,
              block,
              block.getDepth()
            )
          setEditorState(newEditorState)
          setPlusActionMenuInfo((prev) => ({
            ...prev,
            openedBlock: newContentBlock,
          }))
        } else {
          // There is no text in the current block so we should update its type inplace
          setEditorState(forceSelectionToBlock(editorState, blockKey))
          setPlusActionMenuInfo((prev) => ({ ...prev, openedBlock: block }))
        }
      }}
    />
  )
}
export default PlusActionMenuButton
