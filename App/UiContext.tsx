import { createContext, useContext, useState, useEffect } from 'react'


export type language = 'en' | 'fa'

export type direction = 'ltr' | 'rtl'

export interface UiContext {
    showControls: boolean
    setShowControls: SetState < boolean >
    showState: boolean
    setShowState: SetState < boolean >
    language: language
    setLanguage: SetState < language >
    direction: direction
    setDirection: SetState < direction >
}

export const UiContext = createContext < UiContext > ( null )
const useUiContext = () => useContext ( UiContext )
export default useUiContext

export function UiContextProvider ({ children }) {
    const [ showControls, setShowControls ] = useState < boolean > ( localStorage.getItem ( 'showControls' ) === 'true' )
    const [ showState, setShowState ] = useState < boolean > ( localStorage.getItem ( 'showState' ) === 'true' )
    const [ language, setLanguage ] = useState < language > ( localStorage.getItem ( 'lang' ) as language || 'en' )
    const [ direction, setDirection ] = useState < direction > ( localStorage.getItem ( 'dir' ) as direction || 'ltr' )

    useEffect ( () => {
        localStorage.setItem ( 'showControls', showControls.toString () )
        localStorage.setItem ( 'showState', showState.toString () )
        localStorage.setItem ( 'lang', language )
        localStorage.setItem ( 'dir', direction )
    }, [ showControls, showState, language, direction ] )

    return <UiContext.Provider
        value = {{
            showControls, setShowControls,
            showState, setShowState,
            language, setLanguage,
            direction, setDirection
        }}
        children = { children }
    />
}
