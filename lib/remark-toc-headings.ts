import type {Root } from 'mdast'

import {visit} from 'unist-util-visit'

import { Node } from 'unist'

import kebabCase from '../utils/kebabCase'


export interface IToC {
  id: string
  heading: string
  items?: IToC[]
}

interface TOC {
  id: string
  heading: string
  level: string
  parentIndex: number
  items: TOC[] | []
}

interface TocElement extends Node {
  depth?: number
  children?: TocElement[]
  value?: string
}

type Options = {
  exportRef: IToC[]
}

export default function remarkTocHeadings({ exportRef }: Options) {
  return (tree: Root) => {
    // recursive walk to visit all children
    const walk = (children: TocElement[], text = ``, depth = 0) => {
      children.forEach((child) => {
        if (child.type === `text`) {
          text = text + child.value
        } else if (child.children && depth < 3) {
          depth = depth + 1
          text = walk(child.children, text, depth)
        }
      })
      return text
    }

    const toc: TOC[] = []
    visit(tree, 'heading', (node) => {
      const text = walk(node.children || [])
      if (text.length > 0) {
        const id = kebabCase(text)
        const level = String(node.depth || 1)
        toc.push({
          level: level,
          id: id,
          heading: text,
          parentIndex: -1,
          items: [],
        })
      }
    })

    // Walk up the list to find matching parent
    const findParent = (toc: TOC[], parentIndex: number, level: string) => {
      while (parentIndex >= 0 && level < toc[parentIndex].level) {
        parentIndex = toc[parentIndex].parentIndex
      }
      return parentIndex >= 0 ? toc[parentIndex].parentIndex : -1
    }

    // determine parents
    toc.forEach((node, index) => {
      const prev = toc[index > 0 ? index - 1 : 0]
      node.parentIndex =
        node.level > prev.level
          ? (node.parentIndex = index - 1)
          : prev.parentIndex
      node.parentIndex =
        node.level < prev.level
          ? findParent(toc, node.parentIndex, node.level)
          : node.parentIndex
    })

    // add children to their parent
    toc.forEach(
      (node: TOC) =>
        node.parentIndex >= 0 &&
        (toc[node.parentIndex].items as TOC[]).push(node)
    )

    // make final tree
    const tocTree = toc.filter(({ parentIndex }) => parentIndex === -1)

    const removeProps = ({ id, heading, items }: TOC): IToC =>
      items.length > 0
        ? {
            id,
            heading,
            items: (items as TOC[]).map((item) => removeProps(item)),
          }
        : { id, heading }

    tocTree.map((node) => {
      exportRef.push(removeProps(node))
    })
  }
}
