declare module '*.scss' {
    const content: { [className: string]: string }
    export = content
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>
