import styles from './styles.module.scss'


export default function DropIndicator ({ wrapperRect: wr, innerWrapperRect: iwr, closestInfo }) {
    if ( ! closestInfo ) return null
    const { rect: cr, insertionMode, prevPosInfo } = closestInfo
    if ( ! cr || ! wr || ! iwr ) return null
    const offset = ( () => {
        if ( insertionMode === 'after' )
            return cr.bottom + 10 - wr.y
        if ( ! prevPosInfo )
            return cr.y - 10 - wr.y
        const { rect: pr } = prevPosInfo
        return ( pr.bottom + cr.y ) / 2 - wr.y
    } ) ()
    return <div
        className = { styles.dropIndicator }
        style = {{ // @ts-ignore
            '--offset': offset,
            '--x': iwr.x - wr.x,
            '--inner-wrapper-width': iwr.width
        }}
    />
}
