import imagePlugin from 'draft-js-image-plugin'
import Image from './Image'

export default () =>
    imagePlugin({
        imageComponent: Image,
    })
