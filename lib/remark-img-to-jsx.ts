import { visit } from 'unist-util-visit'
import { Node, Parent } from 'unist'
import { Image } from 'mdast'
import { imageDimensions } from './images'

const remarkImgToJsx = () => (tree: any) =>
  new Promise<void>(async (resolve) => {
    const check = (node: any) => {
      return node.type === 'paragraph' && node.children?.some((n: Node) => n.type === 'image')
    }

    const changeNodes = [] as Node[]

    const visitor = (node: any) => {
      node.type = 'div'
      // changeNodes = node.children.filter((child: any) => child.type === 'image')
      node.children.map((child: any) => {
        if (child.type === 'image') {
          changeNodes.push(child)
        }
      })
    }
    visit(tree, check, visitor)
    for (let i = 0; i < changeNodes.length; i++) {
      const imageNode = changeNodes[i]

      const { title, alt, url } = imageNode as Image
      const dimensions = await imageDimensions(url)
      if (dimensions) {
        Object.assign(imageNode, {
          type: 'mdxJsxFlowElement',
          name: 'Image',
          attributes: [
            { type: 'mdxJsxAttribute', name: 'alt', value: alt },
            { type: 'mdxJsxAttribute', name: 'src', value: url },
            { type: 'mdxJsxAttribute', name: 'title', value: title },
            { type: 'mdxJsxAttribute', name: 'width', value: dimensions.width },
            {
              type: 'mdxJsxAttribute',
              name: 'height',
              value: dimensions.height,
            },
          ],
        })
      }
    }

    resolve()
  })

export default remarkImgToJsx
