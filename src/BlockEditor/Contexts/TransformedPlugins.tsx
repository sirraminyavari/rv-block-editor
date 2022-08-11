import { createContext, useContext, FC, useMemo, useRef, useEffect, useCallback, ComponentType } from 'react'

import {
    EditorPlugin,
    EditorPluginObject,
    EditorPluginFunctionArg,
    TransformedInlineStyle,
    TransformedPlusAction,
} from 'BlockEditor'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import createNestingPlugin from 'BlockEditor/InternalPlugins/Nesting'
import createBlockBreakoutPlugin from 'BlockEditor/InternalPlugins/BlockBreakout'
import createUiHandlerPlugin from 'BlockEditor/InternalPlugins/UiHandler'

export interface TransformedPluginsContext {
    // All the Inline Styles extracted from plugins
    inlineStyles: TransformedInlineStyle[]
    // All the Plus Actions extracted from plugins
    plusActions: TransformedPlusAction[]
    // A custom component used to display a custom UI for plugins
    PluginsOverlay: ComponentType
    // All the external and internal plugins ready to be fed to the Plugin Editor
    allPlugins: EditorPluginObject[]
}

export const TransformedPluginsContext = createContext<TransformedPluginsContext>(null)
export const useTransformedPluginsContext = () => useContext(TransformedPluginsContext)
export default useTransformedPluginsContext

export interface TransformedPluginsContextProviderProps {
    plugins: EditorPlugin[]
}

/**
 * Transformes external plugins, utilizes internal plugins & provides access to them all.
 */
export const TransformedPluginsContextProvider: FC<TransformedPluginsContextProviderProps> = ({
    plugins,
    children,
}) => {
    const uiContext = useUiContext()
    const { dict, lang } = uiContext
    const uiContextRef = useRef(uiContext)
    useEffect(() => void (uiContextRef.current = uiContext), [uiContext])

    const pluginArgs = useMemo<EditorPluginFunctionArg>(
        () => ({
            getUiContext: () => uiContextRef.current,
        }),
        []
    )

    const pluginObjects = useMemo<EditorPluginObject[]>(() => toPluginObject(plugins, pluginArgs), [plugins])

    const inlineStyles: TransformedInlineStyle[] = useMemo(
        () => pluginObjects.reduce((acc, plugin) => [...acc, ...(plugin.inlineStyles || [])], []),
        [pluginObjects]
    )

    const plusActions: TransformedPlusAction[] = useMemo(
        () =>
            pluginObjects.reduce(
                (acc, plugin) => [
                    ...acc,
                    ...(plugin.plusActions?.map(plusAction => ({
                        ...plusAction,
                        label: dict[lang][`plugins.${plugin.id}.${plusAction.action}`],
                    })) || []),
                ],
                []
            ),
        [pluginObjects, dict, lang]
    )

    const PluginsOverlay = useCallback(() => {
        const overlayComponents = pluginObjects.map(p => p.OverlayComponent).filter(Boolean)
        // The array of components has been put in a fragment to preserve the correct TS types.
        return (
            <>
                {overlayComponents.map((Comp, i) => (
                    //@ts-expect-error
                    <Comp key={i} />
                ))}
            </>
        )
    }, [pluginObjects, dict, lang])

    const allPlugins = useMemo(() => {
        const nestingPlugin = createNestingPlugin()
        const blockBreakoutPlugin = createBlockBreakoutPlugin({ plusActions })
        const uiHandlerPlugin = createUiHandlerPlugin()

        const internalPlugins = [nestingPlugin, blockBreakoutPlugin, uiHandlerPlugin]
        const internalPluginObjects = toPluginObject(internalPlugins, pluginArgs)
        return [...pluginObjects, ...internalPluginObjects]
    }, [pluginObjects, plusActions])

    return (
        <TransformedPluginsContext.Provider
            value={{ inlineStyles, plusActions, PluginsOverlay, allPlugins }}
            children={children}
        />
    )
}

function toPluginObject(plugins: EditorPlugin[], args: EditorPluginFunctionArg): EditorPluginObject[] {
    return plugins.map(plugin => (typeof plugin === 'function' ? plugin(args) : plugin))
}
