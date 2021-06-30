import { EditorPlugin as _EditorPlugin } from '@draft-js-plugins/editor'


export interface InlineStyle {
    label: string
    style: string
}

export interface EditorPlugin extends _EditorPlugin {
    inlineStyles?: InlineStyle []
}
