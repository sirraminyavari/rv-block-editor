import { EditorState, EditorBlock } from 'draft-js'
import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import cn from 'classnames'

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
