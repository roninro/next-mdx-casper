import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'

import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { HeaderIndex } from '@components/HeaderIndex'
import { StickyNavContainer } from '@effects/StickyNavContainer'
// import { SEO } from '@meta/seo'

import { PostsOrPages } from '@lib/mdx'
import { getAllSettings, Settings } from '@lib/get-settings'
import { seoImage, ISeoImage } from '@meta/seoImage'

import { BodyClass } from '@helpers/BodyClass'
import { getAllPostsMatter } from '@lib/get-posts-data'
import { SEO } from '@components/meta/seo'
import generateRSS from '@lib/generate-rss'

/**
 * Main index page (home page)
 *
 */

interface CmsData {
  posts: PostsOrPages
  settings: Settings
  seoImage: ISeoImage
  bodyClass: string
}

interface IndexProps {
  cmsData: CmsData
}

export default function Index({ cmsData }: IndexProps) {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { settings, seoImage, posts, bodyClass } = cmsData

  return (
    <>
      <SEO {...{ title: settings.title, seoImage }} />
      <StickyNavContainer
        throttle={300}
        activeClass="fixed-nav-active"
        render={(sticky) => (
          <Layout {...{ bodyClass, sticky, settings, isHome: true }} header={<HeaderIndex {...{ settings }} />}>
            <PostView {...{ settings, posts, isHome: true }} />
          </Layout>
        )}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  let settings: Settings
  let posts: PostsOrPages | []

  console.time('Index - getStaticProps')

  try {
    settings = await getAllSettings()
    posts = await getAllPostsMatter()
  } catch (error) {
    throw new Error('Index creation failed.')
  }

  const cmsData = {
    settings,
    posts,
    seoImage: await seoImage({ siteUrl: settings.siteUrl }),
    bodyClass: BodyClass({ isHome: true }),
  }

  generateRSS()

  console.timeEnd('Index - getStaticProps')

  return {
    props: {
      cmsData,
    },
  }
}
