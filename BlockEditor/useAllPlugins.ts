import { useMemo } from 'react'

import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin'

import useEditorContext from './Contexts/EditorContext'
import useUiContext from './Contexts/UiContext'


const useAllPlugins = plugins => {
    const { plusActions } = useEditorContext ()
    const { setPlusMenuInfo } = useUiContext ()

    return useMemo ( () => {
        const blockBreakoutPlugin = createBlockBreakoutPlugin ({
            breakoutBlocks: plusActions.filter ( pa => pa.returnBreakout ).map ( pa => pa.action ),
            doubleBreakoutBlocks: plusActions.filter ( pa => pa.doubleBreakout ).map ( pa => pa.action )
        })

        const uiHandlerPlugin = {
            keyBindingFn ( event ) {
                if ( event.key === 'Escape' )
                    setPlusMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
            }
        }

        return [ ...plugins, blockBreakoutPlugin, uiHandlerPlugin ]
    }, [] )
}
export default useAllPlugins
