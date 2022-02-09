import { FC } from 'react'
import { EditorState, Modifier } from 'draft-js'
import { IconType } from 'react-icons'

import { InlineStyleComponentProps } from 'BlockEditor'
import Button from 'BlockEditor/Ui/Button'

import * as styles from './styles.module.scss'


export interface HocProps {
    entityName: string
    Icon: IconType
    colors: string []
}

export default function getColorSelectComponent ( hocProps: HocProps ) {
    return props => <ColorSelect { ...hocProps } { ...props } />
}

export interface ColorSelectProps extends InlineStyleComponentProps, HocProps {}

export const ColorSelect: FC < ColorSelectProps > = ({ entityName, Icon, colors, editorState, setEditorState }) => {
    return <div className = { styles.colorSelectWrapper }>
        <Button Icon = { Icon } />
        <div className = { styles.colors }>
            { colors.map ( color => <Button
                key = { color }
                Icon = { Icon }
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
