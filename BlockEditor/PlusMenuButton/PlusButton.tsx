import useUiContext from "BlockEditor/UiContext"


export default function PlusButton () {
    const { setPlusMenuInfo } = useUiContext ()
    return <div
        children = '+'
        onClick = { e => setPlusMenuInfo ({ isOpen: true, anchor: e.target as HTMLElement }) }
    />
}
