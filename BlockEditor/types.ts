import { EditorPlugin as _EditorPlugin } from '@draft-js-plugins/editor'
import { IconType } from 'react-icons'


export type language = 'en' | 'fa'
export type direction = 'ltr' | 'rtl'

export interface InlineStyle {
    label: string
    Icon: IconType
    style: string
}

export interface PlusAction {
    label: string
    action: string
    returnBreakout?: boolean
    doubleBreakout?: boolean
}

export interface EditorPlugin extends _EditorPlugin {
    inlineStyles?: InlineStyle []
    plusActions?: PlusAction []
}
