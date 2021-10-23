import { EditorState } from 'draft-js'
import { mergeBlockDataByKey } from 'draft-js-modifiers'
import { Map } from 'immutable'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
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

        blockRendererFn ( contentBlcok, { getEditorState, setEditorState } ) {
            if ( contentBlcok.getType () !== 'accordion' ) return
            const collapsed = !! contentBlcok.getData ().get ( '_collapsed' )
            return {
                component: Accordion,
                props: {
                    collapsed,
                    toggleCollapsed () {
                        const editorState = getEditorState ()
                        const newEditorState = EditorState.forceSelection (
                            mergeBlockDataByKey ( editorState, contentBlcok.getKey (), { _collapsed: ! collapsed } ),
                            editorState.getSelection ()
                        )
                        setImmediate ( () => setEditorState ( newEditorState ) )

                    }
                }
            }
        }
    }
}
