import type { MouseEventHandler } from 'react'
import { DecoratorComponent } from '../../BlockEditor'
import styles from './imageWrapper.module.scss'

const Image: DecoratorComponent = ({ contentState, ...props }) => {
    //@ts-expect-error
    const entity = contentState.getEntity(props?.block.getEntityAt(0))
    const data = entity.getData()
    const type = entity.getType()
    console.log({ data, type })
    return <img {...data} className={styles.imageElement} />
}
export default Image
