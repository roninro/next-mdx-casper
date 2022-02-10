import {
  ComputedFields,
  defineDocumentType,
  makeSource,
} from 'contentlayer/source-files'

import readingTime from 'reading-time'

import remarkTocHeadings , { IToC } from './lib/remark-toc-headings'

// Remark packages
import remarkGfm from 'remark-gfm'
import remarkFootnotes from 'remark-footnotes'
import remarkMath from 'remark-math'
import rehypeImgSize from './lib/rehype-img-size'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCodeTitles from "rehype-code-titles";
import rehypePrismPlus from 'rehype-prism-plus'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'


const tocHeadings = (source: string) => {
  const toc: IToC[] = []
  remark()
    .use(remarkMdx)
    .use(remarkTocHeadings, { exportRef: toc })
    .processSync(source)

  return toc
}

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  wordCount: {
    type: 'number',
    resolve: (doc) => doc.body.raw.split(/\s+/gu).length,
  },
  slug: {
    type: 'string',
    resolve: (doc) =>
      `/${doc._raw.sourceFilePath.replace(
        /(\.(mdx|md))|(\/index\.(mdx|md))/,
        ''
      )}`,
  },
  toc_: {
    type: 'json',
    resolve: (doc) => {
      let toc: IToC[] = []
      toc = tocHeadings(doc.body.raw)
      return toc
    },
  },
}

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/**/*.{mdx,md}',
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    excerpt: { type: 'string', required: false },
    feature_image: { type: 'string', required: false },
    toc: { type: 'boolean', required: false },
    draft: { type: 'boolean', required: false },
    comment: { type: 'boolean', required: false },
    authors: { type: 'json', required: false },
    tags: { type: 'json', required: false },
    page: { type: 'boolean', required: false },
  },
  computedFields,
}))

const Author = defineDocumentType(() => ({
  name: 'Author',
  filePathPattern: 'authors/*.md',
  bodyType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    slug: { type: 'string', required: true },
    location: { type: 'string' },
    profile_image: { type: 'string' },
    cover_image: { type: 'string' },
    bio: { type: 'string' },
    twitter: { type: 'string' },
    facebook: { type: 'string' },
    instagram: { type: 'string' },
    github: { type: 'string' },
    linkedin: { type: 'string' },
    email: { type: 'string' },
    zhihu: { type: 'string' },
  },
  // computedFields,
}))

const OtherPage = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: '*.md',
  bodyType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: false },
    feature_image: { type: 'string', required: false },
    comment: { type: 'boolean', required: false },
    excerpt: { type: 'string', required: false },
  },
  computedFields,
}))

const contentLayerConfig = makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Author, OtherPage],
  mdx: {
    remarkPlugins: [
      remarkGfm,
      [remarkFootnotes, { inlineNotes: true }],
      remarkMath,
    ],
    rehypePlugins: [
      rehypeSlug,
      rehypeImgSize,
      rehypeAutolinkHeadings,
      rehypeKatex,
      rehypeCodeTitles,
      [rehypePrismPlus],
    ],
  },
})

export default contentLayerConfig
