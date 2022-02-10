import Image from 'next/image'

import { SiteNav } from '@components/SiteNav'
import { HeaderBackground } from '@components/HeaderBackground'
import { getLang, get } from '@utils/use-lang'

import { AvatarIcon } from '@icons/AvatarIcon'
import { Author } from '@lib/mdx'
import { Settings } from '@lib/get-settings'

interface HeaderAuthorProps {
  settings: Settings
  author: Author
}

// TODO: fix this author image
export const HeaderAuthor = ({ settings, author }: HeaderAuthorProps) => {
  const { nextImages } = settings
  const text = get(getLang(settings.lang))
  const twitterUrl = author.twitter ? `https://twitter.com/${author.twitter.replace(/^@/, ``)}` : null
  const facebookUrl = author.facebook ? `https://www.facebook.com/${author.facebook.replace(/^\//, ``)}` : null

  const coverImg = author.cover_image || ''
  const profileImg = author.profileImage

  const numberOfPosts = author.count

  // const socials = []
  // if (author.social) {
  //   for (const [key, value] of Object.entries(author.social)) {
  //     if (value) {
  //       socials.push(
  //         <span className="author-social-link" key={key}>
  //           <a href={value} target="_blank" rel="noopener noreferrer">
  //             {key}
  //           </a>
  //         </span>
  //       )
  //     }
  //   }
  // }

  const createSocialLink = (title: string, url: string) => {
    return (
      <span className="author-social-link">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </span>
    )
  }

  return (
    <header className="site-archive-header">
      <div className="outer site-nav-main">
        <div className="inner">
          <SiteNav {...{ settings }} className="site-nav" />
        </div>
      </div>
      <HeaderBackground srcImg={coverImg}>
        <div className="inner">
          <div className="site-header-content author-header">
            {profileImg && nextImages.feature ? (
              <div className="author-profile-image">
                <Image className="author-profile-image" src={profileImg.url} alt={author.name} layout="responsive" quality={nextImages.quality} {...profileImg.dimensions} />
              </div>
            ) : author.profile_image ? (
              /* eslint-disable @next/next/no-img-element */
              <img className="author-profile-image" src={author.profile_image} alt={author.name} />
            ) : (
              <div className="author-profile-image">
                <AvatarIcon />
              </div>
            )}
            <div className="author-header-content">
              <h1 className="site-title">{author.name}</h1>
              {author.bio && <h2 className="author-bio">{author.bio}</h2>}
              <div className="author-meta">
                {author.location && <div className="author-location">{author.location}</div>}
                <div className="author-stats">{(numberOfPosts && ` ${numberOfPosts} ${1 < numberOfPosts ? text(`POSTS`) : text(`POST`)}`) || `${text(`NO_POSTS`)}`}</div>

                {twitterUrl && (
                  <span className="author-social-link">
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                  </span>
                )}
                {facebookUrl && (
                  <span className="author-social-link">
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </HeaderBackground>
    </header>
  )
}
