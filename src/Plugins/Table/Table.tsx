import { EditorBlock } from 'draft-js'
import cn from 'classnames'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import Overlay from 'BlockEditor/Ui/Overlay'
import Button from 'BlockEditor/Ui/Button'

import addColAfterCursor from './lib/addColAfterCursor'
import addRowAfterCursor from './lib/addRowAfterCursor'

import * as styles from './styles.module.scss'
import { TableIcon } from './icons'

export default function getTableComponent(config) {
    return props => <Table config={config} {...props} />
}

function Table({ config, ...props }) {
    const { rowN, colN } = props.blockProps
    return (
        <div
            className={styles.tableOuterWrapper}
            style={{
                // @ts-expect-error
                '--row-n': rowN,
                '--col-n': colN,
            }}>
            <EditorBlock {...props} />
            <TableOptions block={props.block} />
        </div>
    )
}

export function TableCell(props) {
    const { children } = props // It also has 'contentState' & 'entityKey'
    return <span data-table-cell className={styles.tableCell} children={children} />
}

function TableOptions({ block }) {
    const { editorState, setEditorState } = useEditorContext()

    return (
        <Overlay className={styles.tableCellOptions}>
            <Button Icon={TableIcon} onClick={() => setEditorState(addColAfterCursor(editorState, block))} />
            <Button Icon={TableIcon} onClick={() => setEditorState(addRowAfterCursor(editorState, block))} />
            <Button Icon={TableIcon} />
            <Button Icon={TableIcon} />
            <Button Icon={TableIcon} />
        </Overlay>
    )
}
