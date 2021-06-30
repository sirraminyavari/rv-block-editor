import { EditorPlugin } from 'BlockEditor'


export default function createHeadingsPlugin (): EditorPlugin {
    return {
        plusActions: [ 'one', 'two', 'three', 'four', 'five', 'six' ].map ( ( numStr, n ) => ({
            label: `Heading ${ n + 1 }`,
            action: `header-${ numStr }`,
            returnBreakout: true,
        }) )
    }
}
