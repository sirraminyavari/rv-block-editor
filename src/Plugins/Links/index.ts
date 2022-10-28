import { CompositeDecorator } from 'draft-js'

import { EditorPlugin } from 'BlockEditor'
import makeEntityStrategy from 'BlockEditor/Utils/makeEntityStrategy'

import createLinkifyPlugin from '@draft-js-plugins/linkify'
import Link from './Link'
import LinkButton from './LinkButton'

export interface Config {
    ignoredBlockTypes?: string[]
}

export default function createLinksPlugin({ ignoredBlockTypes }: Config = {}): EditorPlugin {
    return {
        id: 'links',

        inlineStyles: [{ Component: LinkButton, ignoredBlockTypes }],

        decorators: [
            new CompositeDecorator([
                {
                    strategy: makeEntityStrategy('LINK'), // TODO: ignoredBlockTypes
                    component: Link,
                },
                ...(createLinkifyPlugin().decorators as any),
            ]),
        ],
    }
}
