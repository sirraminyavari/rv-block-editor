import { DragInfo } from 'BlockEditor/Contexts/UiContext'


export interface Params {
    dragInfo: DragInfo
    setDragInfo: SetState < DragInfo >
}

const getWrapperHandlers = ( { dragInfo, setDragInfo }: Params ) => ({
    // onDragStart: e => setImmediate ( () => setDragInfo ( prev => ({ ...prev, dragging: dragInfo.isDraggingByHandle, elem: e.target }) ) ),
    // onDragEnd: () => {
    //     setDragInfo ( prev => ({ ...prev, isDraggingByHandle: false }) )
    //     setImmediate ( () => setDragInfo ( prev => ({ ...prev, dragging: false, elem: null }) ) )
    // }
})
export default getWrapperHandlers
