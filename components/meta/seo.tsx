import { useRouter } from 'next/router'

import { PostOrPage } from '@lib/mdx'
import { ISeoImage } from '@meta/seoImage'
import { siteConfig } from '@config/site'
import { NextSeo } from 'next-seo'
import { OpenGraphArticle } from 'next-seo/lib/types'

interface SEOProps {
  title?: string
  description?: string
  seoImage?: ISeoImage
  article?: PostOrPage
}


export const SEO = (props: SEOProps) => {
  const { title, description, seoImage, article } = props
  const router = useRouter()

  const titleTemplate = router.asPath === "/" ? "%s" : `%s | ${title}`;

  const ogArticle: OpenGraphArticle = {}
  if (article) {
    ogArticle.publishedTime = article.date || undefined
    ogArticle.authors = article.authors?.map(author => author.name)
  }

  return (
    <NextSeo
      title={title}
      titleTemplate={titleTemplate}
      description={description}
      canonical={`${siteConfig.siteUrl}${router.asPath}`}
      openGraph={{
        type: article ? "article" : "website",
        images: [{ url: seoImage?.url || '' }],
        article: ogArticle,
      }}
      twitter={{
        cardType: "summary_large_image",
        handle: siteConfig.twitter,
      }}
    />
  );
}