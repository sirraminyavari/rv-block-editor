import { BlockControlsInfo } from 'BlockEditor/Contexts/UiContext'


export interface Params {
    blockKey: string
    setBlockControlsInfo: SetState < BlockControlsInfo >
}

const getWrapperHandlers = ( { blockKey, setBlockControlsInfo }: Params ) => ({
    onMouseEnter: e => setBlockControlsInfo ( prev => ({
        ...prev,
        hoveredBlockKey: blockKey,
        hoveredBlockElem: e.target,
        hoveredBlockRect: e.target.getBoundingClientRect ()
    }) )
})
export default getWrapperHandlers
