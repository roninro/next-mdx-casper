import { SiteNav } from '@components/SiteNav'
import { StickyNavContainer } from '@effects/StickyNavContainer'
import { Settings } from '@lib/get-settings'

interface HeaderPostProps {
  settings: Settings
  title?: string
  sticky: StickyNavContainer
}

export const HeaderPost = ({ settings, title, sticky }: HeaderPostProps) => (
  <header className="site-header">
    <div className={`outer site-nav-main ${sticky && sticky.state.currentClass}`}>
      <div className="inner">
        <SiteNav {...{ settings }} className="site-nav" postTitle={title} />
      </div>
    </div>
  </header>
)
