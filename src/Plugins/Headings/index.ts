import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'

import getHeadingComponent from './getHeadingComponent'

import { HeadingIcons } from './icons'

const headings = ['one', 'two', 'three']

export default function createHeadingsPlugin(): EditorPlugin {
    return {
        id: 'headings',

        plusActions: headings.map((heading, n) => ({
            action: `header-${heading}`,
            returnBreakout: true,
            Icon: HeadingIcons[n],
        })),

        blockRenderMap: Map(
            headings
                .map((heading, i) => ({
                    key: `header-${heading}`,
                    element: withBlockWrapper(getHeadingComponent(i + 1), {
                        styles: {
                            wrapper: ['heading-wrapper', `heading${i + 1}-wrapper`],
                        },
                    }),
                }))
                .reduce((acc, { key, ...val }) => ({ ...acc, [key]: val }), {})
        ),
    }
}
