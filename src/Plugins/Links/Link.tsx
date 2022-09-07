import type { MouseEventHandler } from 'react'
import { DecoratorComponent } from '../../BlockEditor'

const Link: DecoratorComponent = ({ contentState, entityKey, children }) => {
    const onClick: MouseEventHandler<HTMLAnchorElement> = event => {
        event.stopPropagation()
    }
    const entity = contentState.getEntity(entityKey)
    if (!entity) return children
    const { href } = entity.getData()
    return <a href={href} target="_blank" children={children} onClick={onClick} />
}
export default Link
