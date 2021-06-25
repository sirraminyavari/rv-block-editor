const getWrapperHandlers = ({ dragInfo, setDragInfo }) => ({
    onDragStart: e => setImmediate ( () => setDragInfo ( prev => ({ ...prev, dragging: dragInfo.isDraggingByHandle, elem: e.target }) ) ),
    onDragEnd: () => {
        setDragInfo ( prev => ({ ...prev, isDraggingByHandle: false }) )
        setImmediate ( () => setDragInfo ( prev => ({ ...prev, dragging: false, elem: null }) ) )
    }
})
export default getWrapperHandlers
