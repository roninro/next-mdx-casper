import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { HeaderAuthor } from '@components/HeaderAuthor'

import { SEO } from '@meta/seo'

import { Author, PostsOrPages } from '@lib/mdx'
import { ISeoImage, seoImage } from '@meta/seoImage'

import { BodyClass } from '@helpers/BodyClass'
import { getAllSettings, Settings } from '@lib/get-settings'
import { getAllPostsMatter } from '@lib/get-posts-data'
import { getAllAuthors } from '@lib/get-authors-data'

interface CmsData {
  author: Author
  posts: PostsOrPages
  seoImage: ISeoImage
  settings: Settings
  bodyClass: string
}

interface AuthorIndexProps {
  cmsData: CmsData
}

const AuthorIndex = ({ cmsData }: AuthorIndexProps) => {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { author, posts, settings, seoImage, bodyClass } = cmsData
  const { name, bio } = author
  const description = bio || undefined

  return (
    <>
      <SEO {...{ settings, description, seoImage, title: name }} />
      <Layout {...{ settings, bodyClass }} header={<HeaderAuthor {...{ settings, author }} />}>
        <PostView {...{ settings, posts }} />
      </Layout>
    </>
  )
}

export default AuthorIndex

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!(params && params.slug && Array.isArray(params.slug))) throw Error('getStaticProps: wrong parameters.')
  const [slug] = params.slug.reverse()

  const settings = await getAllSettings()

  let author: Author | undefined
  let posts: PostsOrPages
  const allPosts = await getAllPostsMatter()
  posts = allPosts.filter(post => post.authors?.some(author => author.slug === slug))

  author = posts[0] && posts[0].authors?.find(author => author.slug === slug)
  if (!author) {
      return {
        notFound: true,
      }
  }
  author.count = posts.length
  const { profile_image } = author
  const siteUrl = settings.siteUrl
  const imageUrl = profile_image || undefined
  const authorImage = await seoImage({ siteUrl, imageUrl })

  return {
    props: {
      cmsData: {
        author,
        posts,
        settings,
        seoImage: authorImage,
        bodyClass: BodyClass({ author }),
      },
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allAuthors = await getAllAuthors()
  
  const paths = allAuthors.map(({ slug }) => `/author/${slug}`)
  return {
    paths,
    fallback: false,
  }
}
