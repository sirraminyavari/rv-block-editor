import { EditorState, Modifier, CompositeDecorator } from 'draft-js'

import { EditorPlugin, DecoratorComponent } from 'BlockEditor'
import makeEntityStrategy from 'BlockEditor/Utils/makeEntityStrategy'

import { FC } from 'react'
import { InlineStyleComponentProps } from 'BlockEditor'
import Button from 'BlockEditor/Ui/Button'
import { TextColorIcon, HighlightColorIcon } from './Icons'
import styles from './styles.module.scss'


export default function createTextAnnotationsPlugin (): EditorPlugin {
    return {
        id: 'links',

        inlineStyles: [
            { Component: getColorSelectComponent ( 'TEXT-COLOR' ) },
            { Component: getColorSelectComponent ( 'HIGHLIHGT-COLOR' ) }
        ],

        decorators: [
            new CompositeDecorator ([
                {
                    strategy: makeEntityStrategy ( 'TEXT-COLOR' ),
                    component: TextColor
                },
                {
                    strategy: makeEntityStrategy ( 'HIGHLIHGT-COLOR' ),
                    component: HighlightColor
                }
            ])
        ]
    }
}


function getColorSelectComponent ( entityName: string ) {
    return props => <ColorSelect entityName = { entityName } { ...props } />
}

export interface ColorSelectProps extends InlineStyleComponentProps {
    entityName: string
}

const ColorSelect: FC < ColorSelectProps > = ({ entityName, editorState, setEditorState }) => {
    return <div className = { styles.colorSelectWrapper }>
        <Button Icon = { TextColorIcon } />
        <div className = { styles.colors }>
            { [ 'red', 'green', 'blue' ].map ( color => <Button
                key = { color }
                Icon = { TextColorIcon }
                style = {{ backgroundColor: color }}
                onClick = { () => {
                    const contentState = editorState.getCurrentContent ()
                    const selectionState = editorState.getSelection ()
                    const contentStateWithEntity = contentState.createEntity ( entityName, 'MUTABLE', { color } )
                    const entityKey = contentStateWithEntity.getLastCreatedEntityKey ()
                    const contentStateWithLink = Modifier.applyEntity (
                        contentStateWithEntity,
                        selectionState,
                        entityKey
                    )
                    const newEditorState = EditorState.set ( editorState, {
                        currentContent: contentStateWithLink
                    } )
                    setEditorState ( newEditorState )
                } }
            /> ) }
        </div>
    </div>
}

const TextColor: DecoratorComponent = ({ contentState, entityKey, children }) => {
    const entity = contentState.getEntity ( entityKey )
    if ( ! entity ) return children
    const { color } = entity.getData ()
    return <span
        style = {{ color }}
        children = { children }
    />
}

const HighlightColor: DecoratorComponent = ({ contentState, entityKey, children }) => {
    const entity = contentState.getEntity ( entityKey )
    if ( ! entity ) return children
    const { color } = entity.getData ()
    return <span
        style = {{ backgroundColor: color }}
        children = { children }
    />
}
