import { useMemo } from 'react'

import createBlockBreakoutPlugin from 'draft-js-block-breakout-plugin'

import useUiContext from './Contexts/UiContext'
import useTransformedPluginsContext from './Contexts/TransformedPlugins'


/**
 * Utilizes internal plugins.
 *
 * @param plugins - All the external plugins
 *
 * @returns All the internal and external plugins ready to use in a Plugin Editor component.
 */
const useAllPlugins = plugins => {
    const { plusActions } = useTransformedPluginsContext ()
    const { setPlusActionMenuInfo } = useUiContext ()

    return useMemo ( () => {
        const blockBreakoutPlugin = createBlockBreakoutPlugin ({
            breakoutBlocks: plusActions.filter ( pa => pa.returnBreakout ).map ( pa => pa.action ),
            doubleBreakoutBlocks: plusActions.filter ( pa => pa.doubleBreakout ).map ( pa => pa.action )
        })

        const uiHandlerPlugin = {
            keyBindingFn ( event ) {
                if ( event.key === 'Escape' )
                    setPlusActionMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
            }
        }

        return [ ...plugins, blockBreakoutPlugin, uiHandlerPlugin ]
    }, [] )
}
export default useAllPlugins
