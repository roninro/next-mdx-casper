import { CommentingSystem, StringKeyMap } from '@lib/get-settings'
import { Disqus } from './Disqus'
import { Giscus } from './Giscus'
interface Props {
  commenting: {
    system: CommentingSystem
    // commentoUrl: string
    disqusShortname: string
    giscusConfig: StringKeyMap
  }
  url?: string
}

export const CommentContainer = (props: Props) => {
  const { commenting, url } = props
  const { system, disqusShortname, giscusConfig } = commenting

  return (
    <section className="post-full-content">
      {system === 'giscus' && <Giscus {...giscusConfig} />}
      {commenting.system === 'disqus' && (
        <Disqus {...{ url, shortname: disqusShortname }} />
      )}
    </section>
  )
}
