import Link from 'next/link'
import dayjs from 'dayjs'

import { PostCard } from '@components/PostCard'

import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'

import { PostOrPage, PostsOrPages, Tag } from '@lib/mdx'
import { Settings } from '@lib/get-settings'

interface PreviewPostsProps {
  settings: Settings
  primaryTag?: Tag | null
  posts?: PostsOrPages
  prev?: PostOrPage
  next?: PostOrPage
}

export const PreviewPosts = ({ settings, primaryTag, posts, prev, next }: PreviewPostsProps) => {
  const text = get(getLang(settings.lang))
  const { siteUrl: cmsUrl } = settings
  const url = (primaryTag && resolveUrl({ cmsUrl, collectionPath: '/tag', slug: primaryTag.slug })) || ''
  const primaryTagCount = primaryTag?.count || 0

  return (
    <aside className="read-next outer">
      <div className="inner">
        <div className="read-next-feed">
          {posts && 0 < posts.length && (
            <article className="read-next-card">
              <header className="read-next-card-header">
                <h3>
                  <span>{text(`MORE_IN`)}</span>{' '}
                  <Link href={url}>
                    <a>{primaryTag?.name}</a>
                  </Link>
                </h3>
              </header>
              <div className="read-next-card-content">
                <ul>
                  {posts?.map((post, i) => (
                    <li key={i}>
                      <h4>
                        <Link href={resolveUrl({ cmsUrl, slug: post.slug })}>
                          <a>{post.title}</a>
                        </Link>
                      </h4>
                      <div className="read-next-card-meta">
                        <p>
                          <time dateTime={post.date || ''}>{dayjs(post.date || '').format('D MMMM, YYYY')}</time> – {post.reading_time?.replace(`min read`, text(`MIN_READ`))}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <footer className="read-next-card-footer">
                <Link href={url}>
                  <a>
                    {(primaryTagCount && primaryTagCount > 0 && (primaryTagCount === 1 ? `1 ${text(`POST`)}` : `${text(`SEE_ALL`)} ${primaryTagCount} ${text(`POSTS`)}`)) ||
                      text(`NO_POSTS`)}{' '}
                    →
                  </a>
                </Link>
              </footer>
            </article>
          )}

          {prev && prev.slug && <PostCard {...{ settings, post: prev }} />}

          {next && next.slug && <PostCard {...{ settings, post: next }} />}
        </div>
      </div>
    </aside>
  )
}
