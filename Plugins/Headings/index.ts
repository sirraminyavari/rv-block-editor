import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import { Map } from 'immutable'

import getHeadingComponent from './getHeadingComponent'


const headings = [ 'one', 'two', 'three' ]

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
                element: withBlockWrapper (
                    getHeadingComponent ( i + 1 ), {
                        styles: {
                            wrapper: [ 'heading-wrapper', `heading${ i + 1 }-wrapper` ]
                        }
                    } )
            }) )
            .reduce ( ( acc, { key, ...val } ) => ({ ...acc, [ key ]: val }), {} )
        )
    }
}
