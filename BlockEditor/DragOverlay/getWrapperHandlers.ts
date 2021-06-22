const getWrapperHandlers = ({ setIsDragging, setDragInfo }) => ({
    onDragStart: e => setImmediate ( () => setDragInfo ({ dragging: true, elem: e.target as HTMLDivElement }) ),
    onDragEnd: () => {
        setIsDragging ( false )
        setImmediate ( () => setDragInfo ({ dragging: false, elem: null }) )
    }
})
export default getWrapperHandlers
