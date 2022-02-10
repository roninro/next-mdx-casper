import { PostItems } from '@components/PostItems'
import { Settings } from '@lib/get-settings'
import { PostsOrPages } from '@lib/mdx'

interface PostViewProps {
  settings: Settings
  posts: PostsOrPages
  isHome?: boolean
}

export const PostView = (props: PostViewProps) => (
  <div className="inner posts">
    <div className="post-feed">
      <PostItems {...props} />
    </div>
  </div>
)
