import { ComponentType } from 'react'
import { EditorState, ContentState, ContentBlock } from 'draft-js'
import { EditorPlugin as _EditorPlugin } from '@draft-js-plugins/editor'
import { IconType } from 'react-icons'

import { UiContext } from 'BlockEditor/Contexts/UiContext'


/**
 * Supported language codes.
 */
export type Language = 'en' | 'fa'

/**
 * Layout directions.
 */
export type Direction = 'ltr' | 'rtl'

/**
 * Dictionary of lables for all supported languages.
 */
export type Dict = {
    [ key in Language ]: {
        [ key: string ]: string
    }
}

// TODO: Docs
export interface InlineStyleComponentProps {
    editorState: EditorState,
    setEditorState: SetState < EditorState >

}
export type InlineStyleComponent = ComponentType < InlineStyleComponentProps >

/**
 * Defines an Inline Style.
 * * Ojects of this interface will be transformed to `TransformedInlineStyle`s by the TrasformedPlugins Context for internal use.
 */
export interface InlineStyle {
    Component?: InlineStyleComponent
    /**
     * The SVG icon associated with the Inline Style.
     */
    Icon?: IconType
    /**
     * The style name to get passed to `RichUtils.toggleInlineStyle`.
     */
    style?: string
}

/**
 * Inline Style after being transformed by TrasformedPlugins Context.
 * * This interface will be used throughout the internal implementation of this editor instead of `InlineStyle`.
 */
export interface TransformedInlineStyle extends InlineStyle {
    /**
     * TODO: This property will be utilized later.
     */
    label: string
}

/**
 * Defines a Plus Action.
 * * Ojects of this interface will be transformed to `TransformedPlusAction`s by the TrasformedPlugins Context for internal use.
 */
export interface PlusAction {
    /**
     * The Block Type of the Plus Action.
     */
    action: string
    /**
     * The SVG icon associated with the Plus Action.
     */
    Icon: IconType
    /**
     * Whether to break out of a Content Block of this Plus Action on return. (e.g. H1)
     */
    returnBreakout?: boolean
    /**
     * Whether to break out of a Content Block of this Plus Action on double return. (e.g. OL)
     */
    doubleBreakout?: boolean
}

/**
 * Plus Action after being transformed by TrasformedPlugins Context.
 * * This interface will be used throughout the internal implementation of this editor instead of `PlusAction`.
 */
export interface TransformedPlusAction extends PlusAction {
    /**
     * The i18ned label of the Plus Action.
     */
    label: string
}

/**
 * Defines an Editor Plugin.
 * * All plugins are also compatible with `@draft-js-plugins` though they might lose some functionality.
 */
export interface EditorPluginObject extends _EditorPlugin {
    /**
     * A unique indentifier for the Plugin.
     */
    id: string
    /**
     * All the Inline Styles of the Plugin.
     */
    inlineStyles?: InlineStyle []
    /**
     * All the Plus Actions of the Plugin.
     */
    plusActions?: PlusAction []
}

export interface EditorPluginFunctionArg {
    getUiContext: () => UiContext
}
export type EditorPluginFunction = ( arg: EditorPluginFunctionArg ) => EditorPluginObject

export type EditorPlugin = EditorPluginObject | EditorPluginFunction


// TODO: Docs
export interface DecoratorComponentProps {
    contentState: ContentState
    children: any
    blockKey: string
    entityKey: string
    offsetKey: string
    decoratedText: string
    dir: any
    start: number
    end: number
}
export type DecoratorComponent = ComponentType < DecoratorComponentProps >

export type StrategyFunction = (
    block: ContentBlock,
    callback: ( start: number, end: number ) => void,
    contentState: ContentState
) => void

export enum Alignment { LEFT = 'left', CENTER = 'center', RIGHT = 'right' }
