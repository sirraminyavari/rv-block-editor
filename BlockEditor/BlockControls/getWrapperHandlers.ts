import { BlockControlsInfo } from 'BlockEditor/Contexts/UiContext'


export interface Params {
    blockKey: string
    blockControlsInfo: BlockControlsInfo
    setBlockControlsInfo: SetState < BlockControlsInfo >
}

const getWrapperHandlers = ( { blockKey, blockControlsInfo, setBlockControlsInfo }: Params ) => ({
    onMouseMove: e => {
        if ( blockControlsInfo.hoveredBlockKey === blockKey && blockControlsInfo.hoveredBlockElem === e.target )
            return
        setBlockControlsInfo ( prev => ({
            ...prev,
            hoveredBlockKey: blockKey,
            hoveredBlockElem: e.target
        }) )
    }
})
export default getWrapperHandlers
