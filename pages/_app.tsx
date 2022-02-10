import type { AppProps } from 'next/app'
import { OverlayProvider } from '@components/contexts/overlayProvider'
import { ThemeProvider } from '@components/contexts/themeProvider'

import '@styles/screen.css'
import '@styles/screen-fixings.css'
import '@styles/dark-mode.css'
import '@styles/prism.css'
import '@styles/toc.css'

import { appConfig } from '@config/site'
import { DarkMode } from '@lib/get-settings'

function MyApp({ Component, pageProps }: AppProps) {
  const darkMode = appConfig.darkMode
  return (
    <ThemeProvider defaultMode={darkMode.defaultMode as DarkMode} overrideOS={darkMode.overrideOS}>
      <OverlayProvider>
        <Component {...pageProps} />
      </OverlayProvider>
    </ThemeProvider>
  )
}

export default MyApp
