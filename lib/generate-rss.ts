import { allPosts } from '.contentlayer/data'
import { siteConfig } from '@config/site'
import { resolveUrl } from '@utils/routing'
import { Feed } from 'feed'
import fs from 'fs'
import path from 'path'

const generateRSS = () => {
  const feed = new Feed({
    id: siteConfig.siteUrl,
    title: siteConfig.title || '',
    description: siteConfig.description || '',
    language: siteConfig.lang || 'en',
    link: siteConfig.siteUrl,
    copyright: '',
  })

  allPosts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: post.slug,
      link: resolveUrl({ cmsUrl: siteConfig.siteUrl, slug: post.slug }),
      description: post.excerpt,
      date: new Date(post.date),
      author:
        post.authors &&
        post.authors.map((author: any) => ({
          name: author,
        })),
    })
  })

  const rssFile = path.join(process.cwd(), 'public', 'rss.xml')

  fs.writeFileSync(rssFile, feed.rss2())
}

export default generateRSS
