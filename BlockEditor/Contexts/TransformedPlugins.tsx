import { createContext, useContext, FC, useMemo } from 'react'
import { EditorPlugin, InlineStyle, TransformedPlusAction } from 'BlockEditor'
import useUiContext from 'BlockEditor/Contexts/UiContext'


export interface TransformedPluginsContext {
    /**
     * All the Inline Styles extracted from plugins
     */
    inlineStyles: InlineStyle []
    /**
     * All the Plus Actions extracted from plugins
     */
    plusActions: TransformedPlusAction []
    /**
     * TODO:
     */
    plugins: EditorPlugin []
}

/**
 * TODO:
 */
export const TransformedPluginsContext = createContext < TransformedPluginsContext > ( null )
export const useTransformedPluginsContext = () => useContext ( TransformedPluginsContext )
export default useTransformedPluginsContext

export interface TransformedPluginsContextProviderProps {
    plugins: EditorPlugin []
}

export const TransformedPluginsContextProvider: FC < TransformedPluginsContextProviderProps > = ({ plugins, children }) => {
    const { dict, lang } = useUiContext ()

    const inlineStyles: InlineStyle [] = plugins.reduce ( ( acc, plugin ) =>
        [ ...acc, ...( plugin.inlineStyles || [] ) ]
    , [] )

    const plusActions: TransformedPlusAction [] = useMemo ( () =>
        plugins.reduce ( ( acc, plugin ) => [
            ...acc, ...( plugin.plusActions?.map ( plusAction => ({
                ...plusAction,
                label: dict [ lang ] [ `plugins.${ plugin.id }.${ plusAction.action }` ]
            }) ) || [] )
        ], [] )
    , [ plugins, dict, lang ] )


    return <TransformedPluginsContext.Provider
        value = {{
            inlineStyles, plusActions, plugins
        }}
        children = { children }
    />
}
