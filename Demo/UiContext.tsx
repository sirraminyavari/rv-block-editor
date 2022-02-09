import { createContext, useContext, useState, useEffect } from 'react'
import { Language, Direction } from 'BlockEditor'



export interface UiContext {
    showControls: boolean
    setShowControls: SetState < boolean >
    debugMode: boolean
    setDebugMode: SetState < boolean >
    readOnly: boolean
    setReadOnly: SetState < boolean >
    textarea: boolean
    setTextarea: SetState < boolean >
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
    const [ debugMode, setDebugMode ] = useState < boolean > ( () => localStorage.getItem ( 'debugMode' ) === 'true' )
    const [ readOnly, setReadOnly ] = useState < boolean > ( () => localStorage.getItem ( 'readOnly' ) === 'true' )
    const [ textarea, setTextarea ] = useState < boolean > ( () => localStorage.getItem ( 'textarea' ) === 'true' )
    const [ language, setLanguage ] = useState < Language > ( () => localStorage.getItem ( 'lang' ) as Language || 'en' )
    const [ direction, setDirection ] = useState < Direction > ( () => localStorage.getItem ( 'dir' ) as Direction || 'ltr' )
    const [ contentPreset, setContentPreset ] = useState < string > ( () => localStorage.getItem ( 'contentPreset' ) || 'empty' )

    useEffect ( () => {
        localStorage.setItem ( 'showControls', showControls.toString () )
        localStorage.setItem ( 'debugMode', debugMode.toString () )
        localStorage.setItem ( 'readOnly', readOnly.toString () )
        localStorage.setItem ( 'textarea', textarea.toString () )
        localStorage.setItem ( 'lang', language )
        localStorage.setItem ( 'dir', direction )
        localStorage.setItem ( 'contentPreset', contentPreset )
    }, [ showControls, debugMode, readOnly, textarea, language, direction, contentPreset ] )

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
            debugMode, setDebugMode,
            readOnly, setReadOnly,
            textarea, setTextarea,
            language, setLanguage,
            direction, setDirection,
            contentPreset, setContentPreset
        }}
        children = { children }
    />
}
