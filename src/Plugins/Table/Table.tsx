import { EditorState } from 'draft-js'
import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import cn from 'classnames'

import BlockEditor, { defaultTheme } from 'BlockEditor'

import * as styles from './styles.module.scss'

export default function getTableComponent(config) {
    return props => <Table config={config} {...props} />
}

function Table({ config, blockProps: { subEditorState, setSubEditorState } }) {
    const editorRef = useRef<any>()

    const { dict, lang, dir, debugMode, uiPortalNode, subEditorsPortalNode } = config.getUiContext()

    // Initialize subEditorState
    useEffect(() => {
        if (subEditorState) return
        const initialSubEditorState = EditorState.createEmpty()
        setSubEditorState(initialSubEditorState, { replace: true })
    }, [])

    if (!subEditorState) return null

    return (
        <div className={styles.tableOuterWrapper}>
            <BlockEditor
                textarea
                ref={editorRef}
                editorState={subEditorState}
                onChange={setSubEditorState}
                dict={dict}
                lang={lang}
                dir={dir}
                plugins={config.plugins}
                styles={defaultTheme}
                uiPortalNode={uiPortalNode}
                subEditorsPortalNode={subEditorsPortalNode}
                debugMode={debugMode}
            />
        </div>
    )
}
