import { allAuthors } from '.contentlayer/data'
import { Author as CAuthor } from '.contentlayer/types'
import kebabCase from '@utils/kebabCase'
import { getAllPostsMatter } from './get-posts-data'
import { Author, createNextImage } from './mdx'
import flatMapDeep from 'lodash.flatmapdeep'

export async function getAllAuthors(): Promise<Author[]> {
  const allPosts = await getAllPostsMatter()
  return flatMapDeep(allPosts, 'authors')
}

export async function getAuthors(authors: string[]): Promise<Author[]> {
  const result = await Promise.all(authors.map(getAuthorBySlug))
  return result
}

export async function getAuthorBySlug(name: string): Promise<Author> {
  const author = allAuthors.find((author) => author.name === name)
  if (author) {
    return await toAuthor(author)
  }
  return {
    name,
    slug: kebabCase(name),
  }
}

async function toAuthor(author: CAuthor): Promise<Author> {
  const { slug, name } = author
  return {
    slug,
    name,
    cover_image: author.cover_image || null,
    profileImage: (await createNextImage(author.profile_image)) || null,
    location: author.location || null,
    bio: author.bio || null,
    twitter: author.twitter || null,
    facebook: author.facebook || null,
  }
}
