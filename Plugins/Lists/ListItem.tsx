import { FC, LiHTMLAttributes } from 'react'


export interface ListItemProps extends LiHTMLAttributes < HTMLLIElement > {}

const ListItem: FC = props => <li
    dir = 'auto'
    { ...props }
/>
export default ListItem
