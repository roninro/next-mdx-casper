import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { Post } from '@components/Post'
import { Page } from '@components/Page'

import { PostsOrPages, PostOrPage } from '@lib/mdx'

import { ISeoImage, seoImage } from '@meta/seoImage'
import { BodyClass } from '@helpers/BodyClass'
import { getAllSettings, Settings } from '@lib/get-settings'
import {
  getAllPostsMatter,
  getPostBySlug,
  getPostsByTag,
} from '@lib/get-posts-data'
import { getAllPages, getPageBySlug } from '@lib/get-pages-data'

/**
 *
 * Renders a single post or page and loads all content.
 *
 */

interface CmsDataCore {
  post: PostOrPage
  settings: Settings
  seoImage: ISeoImage
  previewPosts?: PostsOrPages
  prevPost?: PostOrPage
  nextPost?: PostOrPage
  bodyClass: string
}

interface CmsData extends CmsDataCore {
  isPost: boolean
}

interface PostOrPageProps {
  cmsData: CmsData
}

const PostOrPageIndex = ({ cmsData }: PostOrPageProps) => {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { isPost } = cmsData
  if (isPost) {
    return <Post {...{ cmsData }} />
  } else {
    return <Page cmsData={cmsData} />
  }
}

export default PostOrPageIndex

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!(params && params.slug && Array.isArray(params.slug)))
    throw Error('getStaticProps: wrong parameters.')

  console.time('Post - getStaticProps')

  const settings = await getAllSettings()
  let post: PostOrPage | null = null
  post = await getPostBySlug(`/${params.slug.join('/')}`)
  
  if (!post) {
    post = await getPageBySlug(`/${params.slug.join('/')}`)
  }

  const isPost = !post?.page
  
  if (!post) {
    return {
      notFound: true,
    }
  }

  let previewPosts: PostsOrPages = []
  let prevPost: PostOrPage | null = null
  let nextPost: PostOrPage | null = null

  if (isPost && post.slug) {
    const tagSlug = post.primary_tag?.slug
    if (tagSlug) {
      const posts = await getPostsByTag(tagSlug)
      previewPosts = posts.filter((a) => a.slug !== post?.slug).slice(0, 3)
    }

    const allPosts = await getAllPostsMatter()

    let postIndex = allPosts.findIndex((p) => p.slug === post?.slug)
    prevPost = postIndex > 0 ? allPosts[postIndex - 1] : null
    nextPost = postIndex < allPosts.length - 1 ? allPosts[postIndex + 1] : null
  }

  const siteUrl = settings.siteUrl
  const imageUrl = post?.feature_image || undefined
  const image = await seoImage({ siteUrl, imageUrl })

  const tags = post.tags
  const page = post.page ? post : null

  console.timeEnd('Post - getStaticProps')

  return {
    props: {
      cmsData: {
        settings,
        post,
        isPost,
        seoImage: image,
        previewPosts,
        prevPost,
        nextPost,
        bodyClass: BodyClass({ isPost, tags, page: page || undefined }),
      },
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPostsMatter()
  const pages = await getAllPages()

  const paths = posts.concat(pages).map((p) => p.slug)

  return {
    paths,
    fallback: false,
  }
}
