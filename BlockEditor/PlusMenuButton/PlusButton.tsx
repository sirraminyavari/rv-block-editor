import useUiContext from "BlockEditor/Contexts/UiContext"


export default function PlusButton () {
    const { setPlusMenuInfo } = useUiContext ()
    return <div
        children = '+'
        onClick = { e => setPlusMenuInfo ({ isOpen: true, anchor: e.target as HTMLElement }) }
    />
}
