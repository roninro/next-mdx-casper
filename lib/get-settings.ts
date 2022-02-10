import { createNextImage, NavItem, NextImage, Nullable } from './mdx'
import { siteConfig, appConfig } from 'config/site'

export type DarkMode = 'dark' | 'light' | null
export type CommentingSystem = 'commento' | 'disqus' | 'giscus' | null
export interface StringKeyMap {
  [key: string]: any
}

export interface Settings {
  siteUrl: string
  title?: string | undefined
  description?: string | undefined
  logo?: string | undefined
  icon?: string | undefined
  cover_image?: string | undefined
  facebook?: string | undefined
  twitter?: string | undefined
  lang?: string | undefined
  navigation?:
    | Array<{
        label: string
        url: string
      }>
    | undefined

  // processEnv: ProcessEnvProps
  secondary_navigation?: NavItem[]
  iconImage?: NextImage
  logoImage?: NextImage
  coverImage?: NextImage

  darkMode: {
    defaultMode: DarkMode
    overrideOS: boolean
  }
  nextImages: {
    feature: boolean
    inline: boolean
    quality: number
    source: boolean
  }
  toc: {
    enable: boolean
    maxDepth: number
  }
  commenting: {
    system: CommentingSystem
    // commentoUrl: string
    disqusShortname: string
    giscusConfig: StringKeyMap
  }
}

export async function getAllSettings(): Promise<Settings> {
  const logoImage = await createNextImage(siteConfig.logo)
  const coverImage = await createNextImage(siteConfig.cover_image)

  const result = {
    ...appConfig,
    darkMode: {
      defaultMode: appConfig.darkMode.defaultMode as DarkMode,
      overrideOS: appConfig.darkMode.overrideOS,
    },
    commenting: {
      ...appConfig.commenting,
      system: appConfig.commenting.system as CommentingSystem,
    },
    ...siteConfig,
    ...(logoImage && { logoImage }),
    ...(coverImage && { coverImage }),
  }

  return result
}
