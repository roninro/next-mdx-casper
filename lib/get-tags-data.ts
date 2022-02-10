import flatMapDeep from "lodash.flatmapdeep"
import { getAllPostsMatter } from "./get-posts-data"
import { Tag } from "./mdx"

export async function getAllTags(): Promise<Tag[]> {
  const allPosts = await getAllPostsMatter()
  return flatMapDeep(allPosts, "tags")
}