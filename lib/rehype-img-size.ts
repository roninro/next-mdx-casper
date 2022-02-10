import { visit } from 'unist-util-visit'
import { Root, Element } from 'hast'
import { imageDimensions } from './images'

const rehypeImgSize = () => (tree: Root) =>
  new Promise<void>(async (resolve) => {
    let imgs: Element[] = []

    const visitor = (node: Element) => {
      if (node.tagName === 'p') {
        const chs = node.children.filter(
          (child: any) => child.tagName === 'img'
        )
        imgs = imgs.concat(chs as Element[])
        if (chs.length > 0) {
          node.tagName = 'div'
        }
      }
    }
    visit(tree, 'element', visitor)

    for (let i = 0; i < imgs.length; i++) {
      const img = imgs[i]
      img.properties = img.properties || {}
      const { src } = img.properties
      const dimensions = await imageDimensions(src as string)
      if (dimensions) {
        img.properties.width = dimensions.width
        img.properties.height = dimensions.height
      }
    }

    resolve()
  })

export default rehypeImgSize
