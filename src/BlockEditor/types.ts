import { ComponentType, ReactNode } from 'react'
import { EditorState, ContentState, ContentBlock } from 'draft-js'
import { EditorPlugin as _EditorPlugin } from '@draft-js-plugins/editor'
import { IconType } from 'react-icons'

import { UiContext } from './Contexts/UiContext'

// Supported language codes
export type Language = 'en' | 'fa'

// Layout directions
export type Direction = 'ltr' | 'rtl'

// Dictionary of labels for all supported languages
export type Dict = {
    [key in Language]: {
        [key: string]: string
    }
}

/**
 * These Props are passed to all inline-style custom components
 */
export interface InlineStyleComponentProps {
    editorState: EditorState
    setEditorState: SetState<EditorState>
}
// Inline-style custom component type
export type InlineStyleComponent = ComponentType<InlineStyleComponentProps>

/**
 * Defines an Inline Style.
 * * Objects of this interface will be transformed to `TransformedInlineStyle`s by the TransformedPlugins Context for internal use.
 */
export interface InlineStyle {
    // A custom component to display instead of the default button
    Component?: InlineStyleComponent
    // The SVG icon associated with the Inline Style
    Icon?: IconType
    // The style name to get passed to `RichUtils.toggleInlineStyle`
    style?: string
    // InlineStyle will not be displayed on thsese block types
    ignoredBlockTypes?: string[]
}

/**
 * Inline Style after being transformed by TransformedPlugins Context.
 * * This interface will be used throughout the internal implementation of this editor instead of `InlineStyle`.
 */
export interface TransformedInlineStyle extends InlineStyle {
    // TODO: This property could get utilized later
    label: string
}

/**
 * Defines a State Transformer function.
 * A State Transformer is a function that gets called before setEditorState and
 * insures that incomingEditorState is compatible with the corresponding plugin.
 */
export type StateTransformer = (
    incomingEditorState: EditorState,
    prevEditorState: EditorState
) => EditorState

/**
 * Defines a Plus Action.
 * * Objects of this interface will be transformed to `TransformedPlusAction`s by the TransformedPlugins Context for internal use.
 */
export interface PlusAction {
    // The Block Type of the Plus Action
    action: string
    // The SVG icon associated with the Plus Action
    Icon: IconType
    // Whether to break out of a Content Block of this Plus Action on return. (e.g. H1)
    returnBreakout?: boolean
    // Whether to break out of a Content Block of this Plus Action on double return. (e.g. OL)
    doubleBreakout?: boolean
    // This State Transformer gets called right after a Plus Action is created.
    initialStateTransformer?: StateTransformer
}

/**
 * Plus Action after being transformed by TransformedPlugins Context.
 * * This interface will be used throughout the internal implementation of this editor instead of `PlusAction`.
 */
export interface TransformedPlusAction extends PlusAction {
    // The plugin in which the current Plus Action is defined.
    plugin: EditorPluginObject
}

/**
 * Defines an Editor Plugin.
 * * All plugins are also compatible with `@draft-js-plugins` though they might lose some functionality.
 */
export interface EditorPluginObject extends _EditorPlugin {
    // A unique identifier for the Plugin
    id: string
    // All the Inline Styles of the Plugin
    inlineStyles?: InlineStyle[]
    // All the Plus Actions of the Plugin
    plusActions?: PlusAction[]
    // A component used to display a custom UI for the plugin
    OverlayComponent?: ComponentType<ReactNode>
    // This State Transformer gets called right before every single setEditorState
    stateTransformer?: StateTransformer
}

export interface EditorPluginFunctionArg {
    getUiContext: () => UiContext
}
export type EditorPluginFunction = (
    arg: EditorPluginFunctionArg
) => EditorPluginObject

export type EditorPlugin = EditorPluginObject | EditorPluginFunction

/**
 * All the props passed to each decorator component.
 */
export interface DecoratorComponentProps {
    contentState: ContentState
    children: any
    blockKey: string
    entityKey: string
    offsetKey: string
    decoratedText: string
    dir: any
    // Start of the decorated range
    start: number
    // End of the decorated range
    end: number
}
// Decorator components are used to wrap the decorated ranges
export type DecoratorComponent = ComponentType<DecoratorComponentProps>

// Standard DraftJS strategy function to find decorator ranges
export type StrategyFunction = (
    block: ContentBlock,
    callback: (start: number, end: number) => void,
    contentState: ContentState
) => void

// Supported text-alignments
export enum Alignment {
    LEFT = 'left',
    CENTER = 'center',
    RIGHT = 'right',
}
