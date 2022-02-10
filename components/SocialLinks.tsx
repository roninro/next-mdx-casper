import { TwitterIcon } from '@icons/TwitterIcon'
import { FacebookIcon } from '@icons/FacebookIcon'

import { Settings } from '@lib/get-settings'

interface SocialLinkProps {
  siteUrl: string
  site: Settings
}

export const SocialLinks = ({ siteUrl, site }: SocialLinkProps) => {
  const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
  const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

  return (
    <>
      {site.facebook && (
        <a href={facebookUrl} className="social-link social-link-fb" target="_blank" rel="noopener noreferrer" title="Facebook">
          <FacebookIcon />
        </a>
      )}
      {site.twitter && (
        <a href={twitterUrl} className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Twitter">
          <TwitterIcon />
        </a>
      )}
    </>
  )
}