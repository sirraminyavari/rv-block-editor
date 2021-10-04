import { useEffect, useState } from 'react'


export interface MouseState {
    isDown: boolean
}

export default function useMouseState (): MouseState {
    const [ isDown, setIsDown ] = useState ( false )
    useEffect ( () => {
        const handleDown = () => setIsDown ( true )
        const handleUp = () => setIsDown ( false )
        document.addEventListener ( 'mousedown', handleDown )
        document.addEventListener ( 'mouseup', handleUp )
        return () => {
            document.removeEventListener ( 'mousedown', handleDown )
            document.removeEventListener ( 'mouseup', handleUp )
        }
    }, [] )
    return { isDown }
}
