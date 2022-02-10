import { Dimensions, imageDimensions } from './images'
import { IToC } from './remark-toc-headings'


export interface NextImage {
  url: string
  dimensions: Dimensions
}

export interface NavItem {
  url: string
  label: string
}


export type ArrayOrValue<T> = T | T[]
export type Nullable<T> = T | null

interface MdxResults<T> extends Array<T> {}
export interface Identification {
  slug: string
}

export interface PostOrPage extends Identification {
  title?: string | undefined
  featured?: boolean | undefined
  feature_image?: Nullable<string> | undefined
  date?: Nullable<string> | undefined
  // Post or Page
  page?: Nullable<boolean> | undefined
  draft?: Nullable<boolean> | undefined
  comment?: Nullable<boolean> | undefined
  // Reading time
  reading_time?: string | undefined
  excerpt?: Nullable<string> | undefined
  // Tags - Only shown when using Include param
  tags?: Tag[] | undefined
  primary_tag?: Tag | undefined
  authors?: Author[] | undefined

  featureImage?: NextImage | null
  toc?: IToC[] | null
  mdxSource?: string
}

export interface PostsOrPages extends MdxResults<PostOrPage> {}


export interface MdxPostOrPage extends PostOrPage {
  featureImage?: NextImage | null
  toc?: IToC[] | null
  mdxSource?: string
}

export interface Author extends Identification {
  name: string
  profile_image?: Nullable<string> | undefined
  cover_image?: Nullable<string> | undefined
  location?: Nullable<string> | undefined
  bio?: Nullable<string> | undefined
  twitter?: Nullable<string> | undefined
  facebook?: Nullable<string> | undefined
  profileImage?: NextImage | null
  count?: number | undefined
}


export interface Tag extends Identification {
  name?: string | undefined
  description?: Nullable<string> | undefined
  feature_image?: Nullable<string> | undefined
  count?: number | undefined
}

export interface FeaturedTag extends Tag {
  featureImage?: NextImage
}


export function formatSlug(slug: string) {
  // return slug.replace(/\.(mdx|md)/, '')
  return slug.replace(/(\.(mdx|md))|(\/index\.(mdx|md))/, '')
}

export function dateSortDesc<T = any>(a: T, b: T) {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}


// helpers
export const createNextImage = async (
  url?: string | null
): Promise<NextImage | undefined> => {
  if (!url) return undefined
  const dimensions = await imageDimensions(url)
  return (dimensions && { url, dimensions }) || undefined
}
