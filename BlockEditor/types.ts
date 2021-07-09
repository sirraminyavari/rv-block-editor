import { EditorPlugin as _EditorPlugin } from '@draft-js-plugins/editor'
import { IconType } from 'react-icons'


export type Language = 'en' | 'fa'
export type Direction = 'ltr' | 'rtl'

export type Dict = {
    [ key in Language ]: {
        [ key: string ]: string
    }
}

export interface InlineStyle {
    label: string
    Icon: IconType
    style: string
}

export interface PlusAction {
    action: string
    Icon: IconType
    returnBreakout?: boolean
    doubleBreakout?: boolean
}
export interface TransformedPlusAction extends PlusAction {
    label: string
}

export interface EditorPlugin extends _EditorPlugin {
    id: string
    inlineStyles?: InlineStyle []
    plusActions?: PlusAction []
}
