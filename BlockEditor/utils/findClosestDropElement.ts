export default function findClosest ( event, draggables ) {
    const { clientY: mouseY } = event
    const closest = draggables.reduce ( ( closest, draggable ) => {
        const { y: draggableY, height: draggableHeight } = draggable.getBoundingClientRect ()
        const centerY = draggableY + draggableHeight / 2
        const offset = centerY - mouseY
        if ( offset >= 0 && offset < closest.offset  )
            return { offset, elem: draggable }
        return closest
    }, { offset: Infinity } )
    return closest.elem
}
