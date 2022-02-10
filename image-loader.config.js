// image-loader.config.js
import { imageLoader } from 'next-image-loader/build/image-loader'

// write self-define a custom loader
// (resolverProps: { src: string; width: number; quality?: number }) => string
imageLoader.loader = ({ src, width, quality }) => `${src}`