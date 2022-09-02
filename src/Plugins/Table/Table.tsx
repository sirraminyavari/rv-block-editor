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
        </div>
    )
}

export function TableCell(props) {
    const { contentState, entityKey, children } = props
    return <span data-table-cell className={styles.tableCell} children={children} />
}

export function TableCellOptions(props) {
    const { editorState } = useEditorContext()
    const {
        rtblSelectionState: { domSelection },
        dir,
    } = useUiContext()

    const [menuRef, setMenuRef] = useState<HTMLDivElement>(null)
    const tableCell = useMemo(() => {
        if (!domSelection.isCollapsed) return null
        const tableCell = domSelection.anchorNode?.parentElement?.closest('[data-table-cell]')
        return tableCell
    }, [editorState, domSelection.isCollapsed, domSelection.anchorNode])
    const virtualReference = useMemo(
        () => ({
            getBoundingClientRect() {
                if (!tableCell) return new DOMRect()
                return tableCell.getBoundingClientRect()
            },
        }),
        [tableCell]
    )
    const popper = usePopper(virtualReference, menuRef, {
        placement: `top-${{ ltr: 'start', rtl: 'end' }[dir]}` as any,
    })

    if (!tableCell) return null

    return (
        <div
            ref={setMenuRef}
            className={styles.tableCellOptions}
            style={popper.styles.popper}
            {...popper.attributes.popper}>
            <Overlay>opts</Overlay>
        </div>
    )
}
