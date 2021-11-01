import { InlineStyleComponent, Alignment } from 'BlockEditor'
import Button from 'BlockEditor/Ui/Button'

import setBlockAlignment from './setBlockAlignment'

import styles from './styles.module.scss'


const AlignmentButtons: InlineStyleComponent = ({ editorState, setEditorState }) => {
    return <div className = { styles.buttonWrapper }>
        { Object.values ( Alignment ).map ( alignmentVal => <Button
            key = { alignmentVal }
            onClick = { () => setBlockAlignment ( alignmentVal, editorState, setEditorState ) }
            children = { alignmentVal }
        /> ) }
    </div>
}
export default AlignmentButtons
