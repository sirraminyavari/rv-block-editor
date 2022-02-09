import { FC } from 'react'

import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention.d'

import * as styles from './styles.module.scss'


const MentionComponent: FC < SubMentionComponentProps > = ({ mention, children, ...props }) => <a href = { mention.link }>
    <span
        // { ...props }
        children = { children }
    />
</a>
export default MentionComponent
