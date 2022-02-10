/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'

import { AuthorList } from '@components/AuthorList'
import { PostClass } from '@helpers/PostClass'
// import { collections } from '@lib/collections'
import { PostOrPage } from '@lib/mdx'
import { Settings } from '@lib/get-settings'

interface PostCardProps {
  settings: Settings
  post: PostOrPage
  num?: number
  isHome?: boolean
}

export const PostCard = ({ settings, post, num, isHome }: PostCardProps) => {
  const { nextImages } = settings
  const text = get(getLang(settings.lang))
  const cmsUrl = settings.siteUrl

  const featImg = post.featureImage
  const readingTime = post.reading_time?.replace(`min read`, text(`MIN_READ`))
  const postClass = PostClass({ tags: post.tags, isFeatured: post.featured, isImage: !!featImg })
  const large = (featImg && isHome && num !== undefined && 0 === num % 6 && `post-card-large`) || ``
  const authors = post?.authors?.filter((_, i) => (i < 2 ? true : false))
  const primary_tag = post?.tags?.length ? post.tags[0] : null
  return (
    <article className={`post-card ${postClass} ${large}`}>
      {featImg && (
        <Link href={post.slug}>
          <a className="post-card-image-link" aria-label={post.title}>
            {nextImages.feature ? (
              <div className="post-card-image">
                <Image
                  src={featImg.url}
                  alt={post.title}
                  sizes="(max-width: 640px) 320px, (max-width: 1000px) 500px, 680px"
                  layout="responsive"
                  objectFit="cover"
                  quality={nextImages.quality}
                  {...featImg.dimensions}
                />
              </div>
            ) : (
              post.feature_image && <img className="post-card-image" src={post.feature_image} alt={post.title} />
            )}
          </a>
        </Link>
      )}

      <div className="post-card-content">
        <Link href={post.slug}>
          <a className="post-card-content-link">
            <header className="post-card-header">
              {primary_tag && <div className="post-card-primary-tag">{primary_tag.name}</div>}
              <h2 className="post-card-title">{post.title}</h2>
            </header>
            <section className="post-card-excerpt">
              {/* post.excerpt *is* an excerpt and does not need to be truncated any further */}
              <p>{post.excerpt}</p>
            </section>
          </a>
        </Link>

        <footer className="post-card-meta">
          <AuthorList {...{ settings, authors: post.authors }} />
          <div className="post-card-byline-content">
            {post.authors && post.authors.length > 2 && <span>{text(`MULTIPLE_AUTHORS`)}</span>}
            {post.authors && post.authors.length < 3 && (
              <span>
                {authors?.map((author, i) => (
                  <span key={i}>
                    {i > 0 ? `, ` : ``}
                    <Link href={resolveUrl({ cmsUrl, collectionPath: '/author',  slug: author.slug })}>
                      <a>{author.name}</a>
                    </Link>
                  </span>
                ))}
              </span>
            )}
            <span className="post-card-byline-date">
              <time dateTime={post.date || ''}>{dayjs(post.date || '').format('D MMM YYYY')}&nbsp;</time>
              <span className="bull">&bull; </span> {readingTime}
            </span>
          </div>
        </footer>
      </div>
    </article>
  )
}
