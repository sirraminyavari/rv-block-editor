import { memo } from 'react'
import cn from 'classnames'
import { direction as detectDirection } from 'direction'

import useEditorContext from '../Contexts/EditorContext'
import useUiContext from '../Contexts/UiContext'

import * as styles from './styles.module.scss'

const c = (styles, classes) =>
  classes ? classes.map((c) => styles[c]).join(' ') : ''

/**
 * This component wraps all the Content Blocks and provides a great deal of block editing functionality to them.
 */
const BlockWrapper = ({ Comp, config = {} as any, children, ...rest }) => {
  const { editorState } = useEditorContext()
  const {
    dragInfo,
    blockRefs,
    externalStyles,
    dir,
    blockLevelSelectionInfo,
    debugMode,
    collapsedBlocks,
  } = useUiContext()

  const { block: outOfSyncBlock } = children?.props || rest
  const blockKey = outOfSyncBlock.getKey()
  const blockMap = editorState.getCurrentContent().getBlockMap()
  const syncedBlock = blockMap.get(blockKey)

  if (collapsedBlocks.isCollapsed(blockKey)) return null
  const i = collapsedBlocks.iMap[blockKey]?.i || 0

  return (
    <_Block
      i={i}
      block={syncedBlock}
      Comp={Comp}
      config={config}
      children={children}
      blockRefs={blockRefs}
      externalStyles={externalStyles}
      dir={dir}
      blockLevelSelected={blockLevelSelectionInfo.selectedBlockKeys.some(
        (k) => k === blockKey
      )}
      debugMode={debugMode}
      dragging={
        dragInfo.dragging &&
        dragInfo.isDraggingByHandle &&
        dragInfo.block.getKey() === blockKey
      }
      draggable={dragInfo.isDraggingByHandle}
    />
  )
}
export default BlockWrapper

/**
 * Wraps BlockWrapper's UI elements in a memo to increase performance.
 * TODO: any type
 */
const _Block = memo<any>(
  ({
    i,
    block,
    Comp,
    config,
    children,
    dragging,
    draggable,
    blockRefs,
    externalStyles,
    dir,
    blockLevelSelected,
    debugMode,
  }) => {
    const blockKey = block.getKey()
    const text = block.getText()
    const direction = detectDirection(text)
    const depth = block.getDepth()
    const textAlign = block.getData().get('_align')

    return (
      <div
        ref={(elem) => (blockRefs.current[blockKey] = elem)}
        data-block-key={blockKey}
        className={cn(
          styles.blockWrapper,
          c(externalStyles, config.styles?.wrapper),
          {
            [styles.dragging]: dragging,
            [externalStyles.blockLevelSelected]: blockLevelSelected,
          }
        )}
        // @ts-ignore
        style={{ '--depth': depth }}
        dir={direction === 'neutral' ? dir : direction}
        draggable={draggable}
        {...(debugMode ? { title: blockKey } : {})}>
        <div
          className={c(externalStyles, config.styles?.contentWrapper)}
          style={{ ...(textAlign ? { textAlign } : null) }}>
          <Comp
            className={externalStyles.blockElement}
            children={children}
            {...(config.sendAdditionalProps ? { block, i } : {})}
          />
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Info: Props that we do not expect them to change: Comp, config, externalStyles
    // Info: Props that we do not expcet their reference to change: blockRefs

    // Primitive props:
    if (
      [
        'i',
        'dragging',
        'draggable',
        'dir',
        'blockLevelSelected',
        'debugMode',
      ].some((k) => prevProps[k] !== nextProps[k])
    )
      return false

    // Object props:
    if (
      !prevProps.block.equals(nextProps.block) ||
      prevProps.children !== nextProps.children
    )
      return false

    return true
  }
)

/**
 * An HOC to help wrap custom component inside a `BlockWrapper` and style them properly.
 */
export const withBlockWrapper = (Comp, config?: any) => (props) => {
  return <BlockWrapper Comp={Comp} config={config} {...props} />
}
