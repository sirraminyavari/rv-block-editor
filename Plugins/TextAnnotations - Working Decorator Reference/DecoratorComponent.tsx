import { FC, CSSProperties } from 'react'

import { DecoratorComponentProps } from 'BlockEditor'


export interface HocProps {
    getStyles: ( color: string ) => CSSProperties
}

export default function getDecoratorComponent ( hocProps: HocProps ) {
    return props => <TextAnnotationDecoratorComponent { ...hocProps } { ...props } />
}

export interface TextAnnotationDecoratorComponentProps extends DecoratorComponentProps, HocProps {}

export const TextAnnotationDecoratorComponent: FC < TextAnnotationDecoratorComponentProps > = ({
    getStyles, contentState, entityKey, children
}) => {
    const entity = contentState.getEntity ( entityKey )
    if ( ! entity ) return children
    const { color } = entity.getData ()
    return <span
        style = { getStyles ( color ) }
        children = { children }
    />
}
