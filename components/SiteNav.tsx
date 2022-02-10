/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import Link from 'next/link'

import { Navigation } from '@components/Navigation'
import { SocialLinks } from '@components/SocialLinks'
import { DarkMode } from '@components/DarkMode'
import { getLang, get } from '@utils/use-lang'
import { NextImage } from '@lib/mdx'
import { Settings } from '@lib/get-settings'

export interface SiteNavProps {
  settings: Settings
  className: string
  postTitle?: string
}

export const SiteNav = ({ settings, className, postTitle }: SiteNavProps) => {
  const text = get(getLang(settings.lang))
  const { nextImages } = settings

  const site = settings
  const siteUrl = settings.siteUrl

  const title = text(`SITE_TITLE`, site.title)
  const secondaryNav =
    site.secondary_navigation && 0 < site.secondary_navigation.length
  const siteLogo = site.logoImage

  const navigation = site.navigation

  // targetHeight is coming from style .site-nav-logo img
  const targetHeight = 21
  const calcSiteLogoWidth = (image: NextImage, targetHeight: number) => {
    const { width, height } = image.dimensions
    return (targetHeight * width) / height
  }

  return (
    <nav className={className}>
      <div className="site-nav-left-wrapper">
        <div className="site-nav-left">
          <Link href="/">
            {siteLogo && nextImages.feature ? (
              <a className="site-nav-logo">
                <div
                  style={{
                    height: '${targetHeight}px',
                    width: `${calcSiteLogoWidth(siteLogo, targetHeight)}px`,
                  }}
                >
                  <Image
                    className="site-nav-logo"
                    src={siteLogo.url}
                    alt={title}
                    layout="responsive"
                    quality={nextImages.quality}
                    {...siteLogo.dimensions}
                  />
                </div>
              </a>
            ) : site.logo ? (
              <a className="site-nav-logo">
                <img src={site.logo} alt={title} />
              </a>
            ) : (
              <a className="site-nav-logo">{title}</a>
            )}
          </Link>
          <div className="site-nav-content">
            <Navigation data={navigation} />
            {postTitle && (
              <span className={`nav-post-title ${site.logo ? `` : `dash`}`}>
                {postTitle}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="site-nav-right">
        {secondaryNav ? (
          <Navigation data={site.secondary_navigation} />
        ) : (
          <div className="social-links">
            <SocialLinks {...{ siteUrl, site }} />
          </div>
        )}
        <DarkMode {...{ settings }} />
      </div>
    </nav>
  )
}
