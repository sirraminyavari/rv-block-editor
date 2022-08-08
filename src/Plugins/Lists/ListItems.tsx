import { FC, LiHTMLAttributes } from 'react'
import { ContentBlock } from 'draft-js'
import cn from 'classnames'

import * as styles from './styles.module.scss'

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  i: number
  block: ContentBlock
}

export const OrderedListItem: FC<ListItemProps> = ({
  i,
  block,
  className,
  ...props
}) => {
  const depth = block.getDepth()
  return (
    <li
      className={cn(className, styles.olItem, styles[`style-${depth % 3}`])}
      style={{
        // @ts-ignore
        '--i': i + 1,
      }}
      {...props}
    />
  )
}

export const UnorderedListItem: FC<ListItemProps> = ({
  i,
  block,
  className,
  ...props
}) => {
  const depth = block.getDepth()
  return (
    <li
      className={cn(className, styles.ulItem, styles[`style-${depth % 3}`])}
      {...props}
    />
  )
}
