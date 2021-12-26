import { InlineStyleComponent, Alignment } from 'BlockEditor'
import Button from 'BlockEditor/Ui/Button'

import setBlockAlignment from './setBlockAlignment'

import { AlignLeftIcon, AlignCenterIcon, AlignRightIcon } from './icons'
import styles from './styles.module.scss'


const icons = {
    left: AlignLeftIcon, center: AlignCenterIcon, right: AlignRightIcon
}

const AlignmentButtons: InlineStyleComponent = ({ editorState, setEditorState }) => {
    return <div className = { styles.buttonWrapper }>
        { Object.values ( Alignment ).map ( alignmentVal => <Button
            key = { alignmentVal }
            onClick = { () => setBlockAlignment ( alignmentVal, editorState, setEditorState ) }
            Icon = { icons [ alignmentVal ] }
        /> ) }
    </div>
}
export default AlignmentButtons
