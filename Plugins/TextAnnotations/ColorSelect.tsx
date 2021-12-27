import { FC } from 'react'
import { RichUtils } from 'draft-js'
import { IconType } from 'react-icons'

import { InlineStyleComponentProps } from 'BlockEditor'
import Button from 'BlockEditor/Ui/Button'

import { ColorConfig } from '.'

import styles from './styles.module.scss'


export interface HocProps {
    entityName: string
    Icon: IconType
    colors: ColorConfig []
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
                key = { color.name }
                Icon = { Icon }
                style = {{ backgroundColor: color.color }}
                onClick = { () => {
                    const newEditorState = RichUtils.toggleInlineStyle (
                        editorState,
                        `${ entityName }-${ color.name }`
                    )
                    setEditorState ( newEditorState )
                } }
            /> ) }
        </div>
    </div>
}
