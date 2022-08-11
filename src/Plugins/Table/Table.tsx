import { EditorBlock } from 'draft-js'
import cn from 'classnames'

import * as styles from './styles.module.scss'

export default function getTableComponent(config) {
    return props => <Table config={config} {...props} />
}

function Table({ config, blockProps: { subEditorState, setSubEditorState } }) {
    return <div className={styles.table}></div>
}
