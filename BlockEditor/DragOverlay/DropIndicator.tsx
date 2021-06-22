import styles from './styles.module.scss'


export default function DropIndicator ({ overlayRect: or, closestInfo }) {
    if ( ! closestInfo ) return null
    const { rect: cr, insertionMode } = closestInfo
    return <div
        className = { styles.dropIndicator }
        style = {{ // @ts-ignore
            '--offset': ( cr?.[ { before: 'y', after: 'bottom' } [ insertionMode ] ] || 0 ) - ( or?.y || 0 )
        }}
    />
}
