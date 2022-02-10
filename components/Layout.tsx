import { ReactFragment } from 'react'
import Link from 'next/link'

import { DocumentHead } from '@components/DocumentHead'
import { StickyNav } from '@components/StickyNav'

import { getLang, get } from '@utils/use-lang'

import { StickyNavContainer } from '@effects/StickyNavContainer'
import { resolve } from 'url'
import { Settings } from '@lib/get-settings'

/**
 * Main layout component
 *
 * The Layout component wraps around each page and template.
 * It also provides the header, footer as well as the main
 * styles, and meta data for each page.
 *
 */

interface LayoutProps {
  settings: Settings
  header: ReactFragment
  children: ReactFragment
  isHome?: boolean
  sticky?: StickyNavContainer
  previewPosts?: ReactFragment
  bodyClass: string
  errorClass?: string
}

export const Layout = ({ settings, header, children, isHome, sticky, previewPosts, bodyClass, errorClass }: LayoutProps) => {
  const lang = settings.lang
  const text = get(getLang(lang))
  const site = settings
  const title = text(`SITE_TITLE`, site.title)
  const { siteUrl } = settings

  const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
  const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

  errorClass = errorClass || ``

  return (
    <>
      <DocumentHead className={bodyClass} />

      <div className="site-wrapper">
        {/* The main header section on top of the screen */}
        {header}
        {/* The main content area */}
        <main ref={(isHome && sticky && sticky.anchorRef) || null} id="site-main" className={`site-main outer ${errorClass}`}>
          {/* All the main content gets inserted here, index.js, post.js */}
          {children}
        </main>
        {/* For sticky nav bar */}
        {isHome && <StickyNav className={`site-nav ${sticky && sticky.state.currentClass}`} {...{ siteUrl, settings }} />}
        {/* Links to Previous/Next posts */}
        {previewPosts}

        {/* The footer at the very bottom of the screen */}
        <footer className="site-footer outer">
          <div className="site-footer-content inner">
            <section className="copyright">
              <a href={resolve(siteUrl, '')}>{title}</a> &copy; {new Date().getFullYear()}
            </section>

            <nav className="site-footer-nav">
              <Link href="/">
                <a>{text(`LATEST_POSTS`)}</a>
              </Link>
              {site.facebook && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              )}
              {site.twitter && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                Roninro
              </a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  )
}
