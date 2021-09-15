import { createContext, useContext, useState, useEffect } from 'react'
import { Language, Direction } from 'BlockEditor'



export interface UiContext {
    showControls: boolean
    setShowControls: SetState < boolean >
    showState: boolean
    setShowState: SetState < boolean >
    language: Language
    setLanguage: SetState < Language >
    direction: Direction
    setDirection: SetState < Direction >
    contentPreset: string
    setContentPreset: SetState < string >
}

export const UiContext = createContext < UiContext > ( null )
const useUiContext = () => useContext ( UiContext )
export default useUiContext

export function UiContextProvider ({ children }) {
    const [ showControls, setShowControls ] = useState < boolean > ( () => localStorage.getItem ( 'showControls' ) === 'true' )
    const [ showState, setShowState ] = useState < boolean > ( () => localStorage.getItem ( 'showState' ) === 'true' )
    const [ language, setLanguage ] = useState < Language > ( () => localStorage.getItem ( 'lang' ) as Language || 'en' )
    const [ direction, setDirection ] = useState < Direction > ( () => localStorage.getItem ( 'dir' ) as Direction || 'ltr' )
    const [ contentPreset, setContentPreset ] = useState < string > ( () => localStorage.getItem ( 'contentPreset' ) || 'empty' )

    useEffect ( () => {
        localStorage.setItem ( 'showControls', showControls.toString () )
        localStorage.setItem ( 'showState', showState.toString () )
        localStorage.setItem ( 'lang', language )
        localStorage.setItem ( 'dir', direction )
        localStorage.setItem ( 'contentPreset', contentPreset )
    }, [ showControls, showState, language, direction, contentPreset ] )

    useEffect ( () => {
        document.documentElement.setAttribute ( 'dir', direction )
        document.documentElement.setAttribute ( 'lang', language )
    }, [ direction, language ] )

    useEffect ( () => ({
        'englishText' () {
            setDirection ( 'ltr' )
            setLanguage ( 'en' )
        },
        'persianText' () {
            setDirection ( 'rtl' )
            setLanguage ( 'fa' )
        },
        'theNestedMess' () {
            setDirection ( 'ltr' )
            setLanguage ( 'en' )
        }
    }) [ contentPreset ]?.(), [ contentPreset ] )

    return <UiContext.Provider
        value = {{
            showControls, setShowControls,
            showState, setShowState,
            language, setLanguage,
            direction, setDirection,
            contentPreset, setContentPreset
        }}
        children = { children }
    />
}
