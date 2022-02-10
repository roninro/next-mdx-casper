/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'
import dayjs from 'dayjs'

import { resolveUrl } from '@utils/routing'
import { getLang, get } from '@utils/use-lang'

import { Layout } from '@components/Layout'
import { HeaderPost } from '@components/HeaderPost'
import { AuthorList } from '@components/AuthorList'
import { PreviewPosts } from '@components/PreviewPosts'

import { TableOfContents } from '@components/toc/TableOfContents'

import { StickyNavContainer } from '@effects/StickyNavContainer'
import { SEO } from '@meta/seo'

import { PostClass } from '@helpers/PostClass'

import { ISeoImage } from '@meta/seoImage'

import React from 'react'
import { MDXRenderContent } from './MDXRenderContent'
import { PostOrPage, PostsOrPages } from '@lib/mdx'
import { Settings } from '@lib/get-settings'
import { CommentContainer } from './comments'

interface PostProps {
  cmsData: {
    post: PostOrPage
    settings: Settings
    seoImage: ISeoImage
    previewPosts?: PostsOrPages
    prevPost?: PostOrPage
    nextPost?: PostOrPage
    bodyClass: string
  }
}

export const Post = ({ cmsData }: PostProps) => {
  const { post, settings, seoImage, previewPosts, prevPost, nextPost, bodyClass } = cmsData
  const { slug, excerpt, title } = post
  const { siteUrl: cmsUrl } = settings
  const description = excerpt || undefined
  const { nextImages, toc, commenting } = settings

  const lang = settings.lang
  const text = get(getLang(lang))
  const readingTime = post.reading_time?.replace(`min read`, text(`MIN_READ`))
  const featImg = post.featureImage
  const postClass = PostClass({ tags: post.tags, isFeatured: !!featImg, isImage: !!featImg })

  const mdxSource = post.mdxSource
  if (mdxSource === undefined) throw Error('Post.tsx: htmlAst must be defined.')

  return (
    <>
      <SEO {...{ description, seoImage, article: post, title }} />
      <StickyNavContainer
        throttle={300}
        isPost={true}
        activeClass="nav-post-title-active"
        render={(sticky) => (
          <Layout
            {...{ bodyClass, settings, sticky }}
            header={<HeaderPost {...{ settings, sticky, title }} />}
            previewPosts={<PreviewPosts {...{ settings, primaryTag: post.primary_tag, posts: previewPosts, prev: prevPost, next: nextPost }} />}
          >
            <div className="inner">
              <article className={`post-full ${postClass}`}>
                <header className="post-full-header">
                  {post.primary_tag && (
                    <section className="post-full-tags">
                      <Link href={resolveUrl({ cmsUrl, collectionPath: '/tag', slug: post.primary_tag.slug })}>
                        <a>{post.primary_tag.name}</a>
                      </Link>
                    </section>
                  )}

                  <h1 ref={sticky && sticky.anchorRef} className="post-full-title">
                    {title}
                  </h1>

                  {post.excerpt && <p className="post-full-custom-excerpt">{post.excerpt}</p>}

                  <div className="post-full-byline">
                    <section className="post-full-byline-content">
                      <AuthorList {...{ settings, authors: post.authors, isPost: true }} />

                      <section className="post-full-byline-meta">
                        <h4 className="author-name">
                          {post.authors?.map((author, i) => (
                              <span key={i}>
                              {i > 0 ? `, ` : ``}
                              <Link key={i} href={resolveUrl({ cmsUrl, collectionPath: '/author', slug: author.slug })}>
                                {author.name}
                              </Link>
                              </span>
                          ))}
                        </h4>
                        <div className="byline-meta-content">
                          <time className="byline-meta-date" dateTime={post.date || ''}>
                            {dayjs(post.date || '').format('D MMMM, YYYY')}&nbsp;
                          </time>
                          <span className="byline-reading-time">
                            <span className="bull">&bull;</span> {readingTime}
                          </span>
                        </div>
                      </section>
                    </section>
                  </div>
                </header>

                {featImg &&
                  (nextImages.feature && featImg.dimensions ? (
                    <figure className="post-full-image" style={{ display: 'inherit' }}>
                      <Image
                        src={featImg.url}
                        alt={title}
                        quality={nextImages.quality}
                        priority={true}
                        layout="responsive"
                        sizes={`
                              (max-width: 350px) 350px,
                              (max-width: 530px) 530px,
                              (max-width: 710px) 710px,
                              (max-width: 1170px) 1170px,
                              (max-width: 2110px) 2110px, 2000px
                            `}
                        {...featImg.dimensions}
                      />
                    </figure>
                  ) : (
                    post.feature_image && (
                      <figure className="post-full-image">
                        <img src={post.feature_image} alt={title} />
                      </figure>
                    )
                  ))}

                <section className="post-full-content">
                  {toc.enable && !!post.toc && <TableOfContents {...{ toc: post.toc, url: resolveUrl({ cmsUrl, slug }), maxDepth: toc.maxDepth, lang }} />}
                  <div className="post-content load-external-scripts">
                    <MDXRenderContent mdxSource={mdxSource} />
                  </div>
                </section>

                { !!post.comment &&  commenting.system && <CommentContainer {...{ commenting, url: resolveUrl({ cmsUrl, slug })  }} /> }

              </article>
            </div>
          </Layout>
        )}
      />
    </>
  )
}
