import { useMDXComponent } from 'next-contentlayer/hooks'
import Image from './Image'

const components = {
  img: (props: any) => <Image {...props} />,
}

export interface MDXRendererProps {
  mdxSource: string
  [propName: string]: any
}

export const MDXRenderContent = ({ mdxSource }: MDXRendererProps) => {
  const MDXLayout = useMDXComponent(mdxSource)

  return <MDXLayout components={components} />
}
