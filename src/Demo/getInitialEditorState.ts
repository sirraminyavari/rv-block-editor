import { EditorState, convertFromRaw } from 'draft-js'
import _ from 'lodash'

import _contentPresets from './data/contentPresets.json'

export default function getInitialEditorState(preset) {
    return () => contentPresets[preset]()
}

export const contentPresets = {
    empty: () => EditorState.createEmpty(),
    ..._.mapValues(_contentPresets, preset => () => EditorState.createWithContent(convertFromRaw(preset as any))),
}
