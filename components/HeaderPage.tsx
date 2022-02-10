import { SiteNav } from '@components/SiteNav'
import { Settings } from '@lib/get-settings'

interface HeaderPageProps {
  settings: Settings
}

export const HeaderPage = ({ settings }: HeaderPageProps) => (
  <header className="site-header">
    <div className="outer site-nav-main">
      <div className="inner">
        <SiteNav {...{ settings }} className="site-nav" />
      </div>
    </div>
  </header>
)
