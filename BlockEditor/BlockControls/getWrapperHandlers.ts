import { BlockControlsInfo } from 'BlockEditor/Contexts/UiContext'


export interface Params {
    blockKey: string
    setBlockControlsInfo: SetState < BlockControlsInfo >
}

const getWrapperHandlers = ( { blockKey, setBlockControlsInfo }: Params ) => ({
    onMouseMove: e => setBlockControlsInfo ( prev => ({
        ...prev,
        hoveredBlockKey: blockKey,
        hoveredBlockElem: e.target
    }) )
})
export default getWrapperHandlers
