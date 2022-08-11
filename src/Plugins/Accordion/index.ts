import { Map } from 'immutable'
import _ from 'lodash'

import { EditorPlugin, withBlockWrapper } from 'BlockEditor'
import mergeBlockData from 'BlockEditor/Lib/mergeBlockData'
import setBlockData from 'BlockEditor/Lib/setBlockData'

import { AccordionIcon } from './icons'

import Accordion from './Accordion'

export default function createAccordionPlugin(): EditorPlugin {
    return ({ getUiContext }) => ({
        id: 'accordion',

        plusActions: [{ action: 'accordion', doubleBreakout: true, Icon: AccordionIcon }],

        blockRenderMap: Map({
            accordion: {
                element: withBlockWrapper('div'),
            },
        }) as any,

        blockRendererFn(contentBlock, { getEditorState, setEditorState }) {
            if (contentBlock.getType() !== 'accordion') return
            const collapsed = !!contentBlock.getData().get('_collapsed')
            return {
                component: Accordion,
                props: {
                    collapsed,
                    toggleCollapsed() {
                        const uiContext = getUiContext()
                        if (uiContext.readOnly) return
                        const editorState = getEditorState()
                        const blockKey = contentBlock.getKey()
                        const currentData = contentBlock.getData()
                        const newEditorState = collapsed
                            ? setBlockData(editorState, blockKey, _.omit(currentData.toObject(), ['_collapsed']))
                            : mergeBlockData(editorState, blockKey, { _collapsed: true })
                        uiContext.collapsedBlocks.clearChache()
                        setEditorState(newEditorState)
                    },
                },
            }
        },
    })
}
