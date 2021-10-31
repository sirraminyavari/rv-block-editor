import { DecoratorComponent } from 'BlockEditor'


const Link: DecoratorComponent = ({ contentState, entityKey, children }) => {
    const entity = contentState.getEntity ( entityKey )
    if ( ! entity ) return children
    const { href } = entity.getData ()
    return <a
        href = { href }
        target = '_blank'
        children = { children }
    />
}
export default Link
