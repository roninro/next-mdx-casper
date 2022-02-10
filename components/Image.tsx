import NextImage from 'next/image'

interface ImgProps {
  src: string
  title?: string
  alt?: string
  width?: number
  height?: number
}

export const Image = (props: ImgProps) => {
  const { title } = props
  return (
    <figure className="kg-card kg-image-card">
      <img className='kg-image' {...props} />
      { title && <figcaption>{title}</figcaption> }
    </figure>
  )

}

export default Image