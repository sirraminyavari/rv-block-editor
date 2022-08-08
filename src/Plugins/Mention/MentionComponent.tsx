import { FC } from 'react'

import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention.d'

const MentionComponent: FC<SubMentionComponentProps> = ({ mention, children }) => (
    <a href={mention.link}>
        <span children={children} />
    </a>
)
export default MentionComponent
