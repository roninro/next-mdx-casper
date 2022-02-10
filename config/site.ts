export const siteConfig = {
  siteUrl: 'https://next-mdx-casper.vercel.app',
  title: 'Mdx Blog Demo',
  description: 'Thoughts, stories and ideas.',
  logo: '/static/images/logo.png',
  cover_image: '',
  facebook: 'ghost',
  twitter: '@ghost',
  lang: 'en',
  navigation: [
    { label: 'Home', url: '/' },
    { label: 'About', url: '/about/' },
  ],
  secondary_navigation: [
    // { label: 'Data & privacy', url: '/privacy/' },
    // { label: 'Contact', url: '/contact/' },
  ],
}

export const appConfig = {
  // Dark mode
  darkMode: {
    defaultMode: 'light',
    overrideOS: true,
  },
  nextImages: {
    feature: true,
    inline: true,
    quality: 80,
    source: false,
  },
  rssFeed: true,
  toc: {
    enable: true,
    maxDepth: 2,
  },
  commenting: {
    system: 'giscus',
    // commentoUrl: '',
    disqusShortname: '',
    giscusConfig: {
      repo: 'roninro/crispy-bassoon',
      repoId: 'R_kgDOGgPnJw',
      category: 'Comments',
      categoryId: 'DIC_kwDOGgPnJ84CANaJ',
      mapping: 'pathname',
      emitMetadata: false,
      reactionsEnabled: true,
    },
  },
}

// Cache control
export const fileCache: boolean = true
