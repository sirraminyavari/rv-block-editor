import { EditorBlock } from 'draft-js'
import cn from 'classnames'

import * as styles from './styles.module.scss'

export default function getTableComponent(config) {
    return props => <Table config={config} {...props} />
}

function Table({}) {
    return <div></div>
}
