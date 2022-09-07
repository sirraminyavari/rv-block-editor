import type { FC, MouseEventHandler } from 'react'

import { SubMentionComponentProps } from '@draft-js-plugins/mention/lib/Mention.d'

const MentionComponent: FC<SubMentionComponentProps> = ({ mention, children }) => {
    const onClick: MouseEventHandler<HTMLAnchorElement> = event => {
        event.stopPropagation()
    }
    return (
        <a href={mention.link} onClick={onClick} target="_blank">
            <span children={children} />
        </a>
    )
}
export default MentionComponent
