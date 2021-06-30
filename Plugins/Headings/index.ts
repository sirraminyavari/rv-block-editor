import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { Map } from 'immutable'


const headings = [ 'one', 'two', 'three', 'four', 'five', 'six' ]

export default function createHeadingsPlugin (): EditorPlugin {
    return {
        plusActions: headings.map ( ( heading, n ) => ({
            label: `Heading ${ n + 1 }`,
            action: `header-${ heading }`,
            returnBreakout: true,
        }) ),
        blockRenderMap: Map ( headings
            .map ( ( heading, i ) => ({
                key: `header-${ heading }`,
                element: withBlockWrapper ( `h${ i + 1 }` )
            }) )
            .reduce ( ( acc, { key, ...val } ) => ({ ...acc, [ key ]: val }), {} )
        )
    }
}
