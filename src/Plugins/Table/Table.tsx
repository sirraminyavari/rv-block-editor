import { useLayoutEffect, useRef } from 'react'
import { EditorBlock } from 'draft-js'
import _ from 'lodash'
import cn from 'classnames'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import Overlay from 'BlockEditor/Ui/Overlay'
import Button from 'BlockEditor/Ui/Button'
import getObjData from 'BlockEditor/Lib/getObjData'
import useUiContext from 'BlockEditor/Contexts/UiContext'

import * as styles from './styles.module.scss'
import tableActions from './actions'
import { TableIcon } from './icons'

export default function getTableComponent(config) {
    return props => <Table config={config} {...props} />
}

let tableIdCounter = -1
const makeTableId = () => 'table-id-' + ++tableIdCounter

function Table({ config, ...props }) {
    const tableId = useRef('')
    useLayoutEffect(() => {
        tableId.current = makeTableId()
    }, [])
    const { externalStyles } = useUiContext()

    const { rowN, colN, data } = props.blockProps

    return (
        <>
            <style
                style={{ display: 'none' }}
                dangerouslySetInnerHTML={{
                    __html: _.reduce(
                        _.mapValues(
                            getObjData(data, 'alignments'),
                            (align, cellN) =>
                                `#${tableId.current} [data-table-cell]:nth-child(${
                                    +cellN + 1
                                }) { text-align: ${align}; }`
                        ),
                        (acc, val) => acc + ' ' + val,
                        ''
                    ),
                }}
            />
            <div
                id={tableId.current}
                className={externalStyles.table}
                style={{
                    // @ts-expect-error
                    '--row-n': rowN,
                    '--col-n': colN,
                }}>
                <EditorBlock {...props} />
                <TableOptions block={props.block} rowN={rowN} colN={colN} />
            </div>
        </>
    )
}

export function TableCell(props) {
    const { children } = props // It also has 'contentState' & 'entityKey'
    const { externalStyles } = useUiContext()

    return <span data-table-cell className={externalStyles.tableCell} children={children} />
}

function TableOptions({ block, rowN, colN }) {
    const { editorState, setEditorState } = useEditorContext()
    const { externalStyles } = useUiContext()
    const blockKey = block.getKey()
    const selectionState = editorState.getSelection()
    const isRangeInside =
        selectionState.getAnchorKey() === blockKey &&
        selectionState.getFocusKey() === blockKey &&
        !selectionState.isCollapsed()

    return (
        <Overlay className={externalStyles.tableCellOptions}>
            <Button
                Icon={TableIcon}
                onClick={() => setEditorState(tableActions.addRowAfterCursor(editorState, block))}
                disabled={isRangeInside}
            />
            <Button
                Icon={TableIcon}
                onClick={() => setEditorState(tableActions.addColAfterCursor(editorState, block))}
                disabled={isRangeInside}
            />
            <Button
                Icon={TableIcon}
                onClick={() => setEditorState(tableActions.removeRowByCursor(editorState, block))}
                disabled={isRangeInside || rowN <= 1}
            />
            <Button
                Icon={TableIcon}
                onClick={() => setEditorState(tableActions.removeColByCursor(editorState, block))}
                disabled={isRangeInside || colN <= 1}
            />
            <Button
                Icon={TableIcon}
                onClick={() => setEditorState(tableActions.removeTable(editorState, block))}
                disabled={isRangeInside}
            />
        </Overlay>
    )
}
