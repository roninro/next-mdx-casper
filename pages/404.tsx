import Link from 'next/link'
import { GetStaticProps } from 'next'

import { Layout } from '@components/Layout'
import { HeaderPage } from '@components/HeaderPage'
import { PostCard } from '@components/PostCard'

import { PostsOrPages } from '@lib/mdx'
import { getLang, get } from '@utils/use-lang'
import { BodyClass } from '@helpers/BodyClass'
import { getAllSettings, Settings } from '@lib/get-settings'
import { getAllPostsMatter } from '@lib/get-posts-data'

export const getStaticProps: GetStaticProps = async () => {
  const settings = await getAllSettings()

  let posts = await getAllPostsMatter()
  posts = posts.slice(0, 3)

  return {
    props: {
      settings,
      posts,
      bodyClass: BodyClass({}),
    },
  }
}

interface Custom404Props {
  posts: PostsOrPages
  settings: Settings
  bodyClass: string
}

export default function Custom404({ posts, settings, bodyClass }: Custom404Props) {
  const text = get(getLang(settings.lang))

  return (
    <Layout {...{ settings, bodyClass }} header={<HeaderPage {...{ settings }} />} errorClass="error-content">
      <div className="inner">
        <section className="error-message">
          <h1 className="error-code">404</h1>
          <p className="error-description">{text(`PAGE_NOT_FOUND`)}</p>
          <Link href="/">
            <a className="error-link">{text(`GOTO_FRONT_PAGE`)} →</a>
          </Link>
        </section>

        <div className="post-feed">
          {posts.map((post, i) => (
            <PostCard key={i} {...{ settings, post, num: i }} />
          ))}
        </div>
      </div>
    </Layout>
  )
}
