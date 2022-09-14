import { Map } from 'immutable'

/**
 * 'mergeBlockData' and its similar methods save object data enttries as 'immutable Map's.
 * Whereas 'EditorState.createWithContent(convertFromRaw(rawContent)))' stores them as plain JS objects.
 * This function handles that mismatch and always returns a JS object or undefined.
 */
export default function getObjData<T = object>(data: Map<string, any>, key: string): T | undefined {
    const record = data.get(key)
    if (!record) return
    return ('toJS' in record ? record.toJS() : record) as T
}
