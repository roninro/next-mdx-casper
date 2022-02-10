import { allPages } from ".contentlayer/data"
import { Page } from ".contentlayer/types"
import { createNextImage, PostOrPage, PostsOrPages } from "./mdx"

export async function getAllPages(): Promise<PostsOrPages> {
  const results = await Promise.all(allPages.map(toPostOrPage))
  return results
}


export async function getPageBySlug(slug: string): Promise<PostOrPage> {
  const post = allPages.find((post) => post.slug === slug)
  const result = await toPostOrPage(post!)
  result.mdxSource = post?.body.code
  
  return result
}


async function toPostOrPage(page: Page): Promise<PostOrPage> {
  const {
    slug,
    title,
    date,
    comment,
    excerpt,
    feature_image,
  } = page
  return {
    slug,
    title,
    date: date || undefined,
    excerpt: excerpt || null,
    page: true,
    comment: comment === false ? false : true,
    featureImage: (await createNextImage(feature_image)) || null,
    mdxSource: page.body.code,
  }
}
