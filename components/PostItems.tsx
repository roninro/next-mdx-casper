import { PostCard } from '@components/PostCard'
import { Settings } from '@lib/get-settings'
import { PostsOrPages } from '@lib/mdx'


interface PostItemsProps {
  settings: Settings
  posts: PostsOrPages
  isHome?: boolean
}

export const PostItems = ({ settings, posts, isHome }: PostItemsProps) => (
  <>
    {posts.map((post, i) => (
      <PostCard key={i} {...{settings, post, isHome, num: i }} />
    ))}
  </>
)
