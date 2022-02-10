import { DiscussionEmbed } from 'disqus-react'

interface DisqusCommentsProps {
  url?: string;
  identifier?: string;
  title?: string;
  shortname: string
}

export const Disqus = ({ url, identifier, title, shortname }: DisqusCommentsProps) => {

  const config = { url, title, identifier }

  return (
      <DiscussionEmbed {...{ shortname, config }} />
  )
}
