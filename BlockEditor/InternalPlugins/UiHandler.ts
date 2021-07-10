import { EditorPlugin } from 'BlockEditor'
import { PlusActionMenuInfo } from 'BlockEditor/Contexts/UiContext'


export interface Config {
    setPlusActionMenuInfo: SetState < PlusActionMenuInfo >
}

export default function createUiHandlerPlugin ( { setPlusActionMenuInfo }: Config ): EditorPlugin {
    return {
        id: '__internal__ui-handler',
        keyBindingFn ( event ) {
            if ( event.key === 'Escape' )
                setPlusActionMenuInfo ( prev => ({ ...prev, openedBlock: null }) )
            return undefined
        }
    }
}
