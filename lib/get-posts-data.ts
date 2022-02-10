import { allPosts } from '.contentlayer/data'
import { Post } from '.contentlayer/types'
import kebabCase from '@utils/kebabCase'
import { getAuthors } from './get-authors-data'
import { createNextImage, dateSortDesc, PostOrPage, PostsOrPages } from './mdx'
import { IToC } from './remark-toc-headings'

export async function getAllPostsMatter(): Promise<PostsOrPages> {
  const results = await Promise.all(allPosts.map(toPostOrPage))

  return results.sort((a, b) => dateSortDesc(a.date, b.date))
}

export async function getPostBySlug(slug: string): Promise<PostOrPage | null> {
  const post = allPosts.find((post) => post.slug === slug)
  if (!post) {
    return null
  }
  const result =await toPostOrPage(post)
  result.mdxSource = post?.body.code
  if (result.primary_tag) {
    result.primary_tag.count = allPosts.filter((post) => post.tags.includes(result.primary_tag?.name)).length
  }
  return result
}


export async function getPostsByTag(tag:string): Promise<PostsOrPages> {
  const posts = allPosts.filter((post) => post.tags.includes(tag))
  return Promise.all(posts.map(toPostOrPage))
}

export async function getPostsByAuthor(author:string): Promise<PostsOrPages> {
  const posts = allPosts.filter((post) => post.authors.includes(author))
  return Promise.all(posts.map(toPostOrPage))
}


async function toPostOrPage(post: Post): Promise<PostOrPage> {
  const {
    slug,
    title,
    date,
    excerpt,
    draft,
    comment,
    toc,
    toc_,
    feature_image,
    tags,
    authors,
    page,
    readingTime,
  } = post
  const _tags = tags.map((tag: string) => ({ name: tag, slug: kebabCase(tag) }))
  return {
    slug,
    title,
    date,
    excerpt: excerpt || null,
    draft: draft || false,
    page: page || false,
    comment: comment === false ? false : true,
    featureImage: (await createNextImage(feature_image)) || null,
    toc: toc === true ? (toc_ as IToC[]) : null,
    tags: _tags || [],
    authors: (await getAuthors(authors || [])) || null,
    primary_tag: _tags[0] || null,
    reading_time: readingTime.text,
  }
}
