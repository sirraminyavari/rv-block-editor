import { EditorState, EditorBlock } from 'draft-js'
import { useState, useRef, useLayoutEffect, useEffect, useMemo } from 'react'
import cn from 'classnames'
import { usePopper } from 'react-popper'
import useUiContext from 'BlockEditor/Contexts/UiContext'
import useEditorContext from 'BlockEditor/Contexts/EditorContext'
import Overlay from 'BlockEditor/Ui/Overlay'

import BlockEditor, { defaultTheme } from 'BlockEditor'

import * as styles from './styles.module.scss'

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
            <TableOptions />
        </div>
    )
}

export function TableCell(props) {
    const { contentState, entityKey, children } = props
    return <span data-table-cell className={styles.tableCell} children={children} />
}

function TableOptions(props) {
    const { editorState } = useEditorContext()

    return <Overlay className={styles.tableCellOptions}>opts</Overlay>
}
