import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import mergeBlockDataByKey from 'BlockEditor/Lib/mergeBlockDataByKey'

import { AccordionIcon } from './icons'

import Accordion from './Accordion'


export default function createAccordionPlugin ( config: any = {} ): EditorPlugin {
    return {
        id: 'accordion',

        plusActions: [
            { action: 'accordion', doubleBreakout: true, Icon: AccordionIcon },
        ],

        blockRenderMap: Map ({
            'accordion': {
                element: withBlockWrapper ( 'div' ),
            }
        }) as any,

        blockRendererFn ( contentBlock, { getEditorState, setEditorState } ) {
            if ( contentBlock.getType () !== 'accordion' ) return
            const collapsed = !! contentBlock.getData ().get ( '_collapsed' )
            return {
                component: Accordion,
                props: {
                    collapsed,
                    toggleCollapsed () {
                        const editorState = getEditorState ()
                        const newEditorState = mergeBlockDataByKey (
                            editorState,
                            contentBlock.getKey (),
                            { _collapsed: ! collapsed }
                        )
                        setEditorState ( newEditorState )
                    }
                }
            }
        }
    }
}
