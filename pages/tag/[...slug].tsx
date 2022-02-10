import { useRouter } from 'next/router'

import { FeaturedTag, PostsOrPages } from '@lib/mdx'
import { GetStaticProps, GetStaticPaths } from 'next'
import { HeaderTag } from '@components/HeaderTag'
import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { SEO } from '@meta/seo'

import { ISeoImage, seoImage } from '@meta/seoImage'

import { BodyClass } from '@helpers/BodyClass'
import { getAllSettings, Settings } from '@lib/get-settings'
import { getAllTags } from '@lib/get-tags-data'
import { getAllPostsMatter } from '@lib/get-posts-data'

/**
 * Tag page (/tag/:slug)
 *
 */

interface CmsData {
  tag: FeaturedTag
  posts: PostsOrPages
  seoImage: ISeoImage
  settings: Settings
  bodyClass: string
}

interface TagIndexProps {
  cmsData: CmsData
}

const TagIndex = ({ cmsData }: TagIndexProps) => {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { tag, posts, settings, seoImage, bodyClass } = cmsData
  // const { meta_title, meta_description } = tag

  return (
    <>
      {/* <SEO {...{ settings, title: meta_title || '', description: meta_description || '', seoImage }} /> */}
      <Layout {...{ settings, bodyClass }} header={<HeaderTag {...{ settings, tag }} />}>
        <PostView {...{ settings, posts }} />
      </Layout>
    </>
  )
}

export default TagIndex

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!(params && params.slug && Array.isArray(params.slug))) throw Error('getStaticProps: wrong parameters.')
  const [slug] = params.slug.reverse()

  let tag: FeaturedTag | undefined
  let posts: PostsOrPages

  const allPosts = await getAllPostsMatter()
  posts = allPosts.filter(post => post.tags?.some(tag => tag.slug === slug))

  tag = posts[0] && posts[0].tags?.find(tag => tag.slug === slug)
  if (!tag) {
      return {
        notFound: true,
      }
  }
  tag.count = posts.length

  const settings = await getAllSettings()

  return {
    props: {
      cmsData: {
        tag,
        posts,
        settings,
        seoImage: await seoImage({ siteUrl: settings.siteUrl }),
        bodyClass: BodyClass({ tags: [tag] }),
      },
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getAllTags()
  const paths = tags.map(({ slug }) => `/tag/${slug}`)
  return {
    paths,
    fallback: false,
  }
}
