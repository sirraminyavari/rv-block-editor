import { CompositeDecorator } from 'draft-js'

import { EditorPlugin } from '../../BlockEditor'
import makeEntityStrategy from '../../BlockEditor/Utils/makeEntityStrategy'

import createLinkifyPlugin from '@draft-js-plugins/linkify'
import Link from './Link'
import LinkButton from './LinkButton'

export default function createLinksPlugin(): EditorPlugin {
    return {
        id: 'links',

        inlineStyles: [{ Component: LinkButton }],

        decorators: [
            new CompositeDecorator([
                {
                    strategy: makeEntityStrategy('LINK'),
                    component: Link,
                },
                ...(createLinkifyPlugin().decorators as any),
            ]),
        ],
    }
}
