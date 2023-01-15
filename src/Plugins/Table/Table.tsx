// TODO: Docs
import { useLayoutEffect, useRef } from 'react'
import { EditorBlock } from 'draft-js'
import _ from 'lodash'
import cn from 'classnames'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import Overlay from 'BlockEditor/Ui/Overlay'
import Button from 'BlockEditor/Ui/Button'
import getObjData from 'BlockEditor/Lib/getObjData'

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
                                `#${
                                    tableId.current
                                } [data-table-cell]:nth-child(${
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
                className={cn(styles.table, config.styles?.table)}
                style={{
                    // @ts-expect-error
                    '--row-n': rowN,
                    '--col-n': colN,
                }}>
                <EditorBlock {...props} />
                <TableOptions
                    className={cn(
                        styles.tableCellOptions,
                        config.styles?.tableCellOptions
                    )}
                    block={props.block}
                    rowN={rowN}
                    colN={colN}
                />
            </div>
        </>
    )
}

export function getTableCellComponent(config) {
    return props => <TableCell config={config} {...props} />
}

export function TableCell({ config, ...props }) {
    const { children } = props // It also has 'contentState' & 'entityKey'
    return (
        <span
            data-table-cell
            className={cn(styles.tableCell, config.styles?.tableCell)}
            children={children}
        />
    )
}

function TableOptions({ className, block, rowN, colN }) {
    const { editorState, setEditorState } = useEditorContext()
    const blockKey = block.getKey()
    const selectionState = editorState.getSelection()
    const isRangeInside =
        selectionState.getAnchorKey() === blockKey &&
        selectionState.getFocusKey() === blockKey &&
        !selectionState.isCollapsed()

    return (
        <Overlay className={className}>
            <Button
                Icon={TableIcon}
                onClick={() =>
                    setEditorState(
                        tableActions.addRowAfterCursor(editorState, block)
                    )
                }
                disabled={isRangeInside}
            />
            <Button
                Icon={TableIcon}
                onClick={() =>
                    setEditorState(
                        tableActions.addColAfterCursor(editorState, block)
                    )
                }
                disabled={isRangeInside}
            />
            <Button
                Icon={TableIcon}
                onClick={() =>
                    setEditorState(
                        tableActions.removeRowByCursor(editorState, block)
                    )
                }
                disabled={isRangeInside || rowN <= 1}
            />
            <Button
                Icon={TableIcon}
                onClick={() =>
                    setEditorState(
                        tableActions.removeColByCursor(editorState, block)
                    )
                }
                disabled={isRangeInside || colN <= 1}
            />
            <Button
                Icon={TableIcon}
                onClick={() =>
                    setEditorState(tableActions.removeTable(editorState, block))
                }
                disabled={isRangeInside}
            />
        </Overlay>
    )
}
