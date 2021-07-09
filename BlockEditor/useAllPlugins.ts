import { useMemo } from 'react'

import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin'

import useUiContext from './Contexts/UiContext'
import useTransformedPluginsContext from './Contexts/TransformedPlugins'


const useAllPlugins = plugins => {
    const { plusActions } = useTransformedPluginsContext ()
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
