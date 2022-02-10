import probe from 'probe-image-size'
import { getCache, setCache } from './cache'
import fs from 'fs'
import { createReadStream, createWriteStream, existsSync } from 'fs'
import { join } from 'path'

import { sha1 } from 'crypto-hash'

const imageRoot = join(process.cwd(), 'public')

/**
 * Determine image dimensions
 *
 * probe-image-size reacts sensitivily on bad network connections
 * See: https://github.com/nodeca/probe-image-size/issues/46
 * Frequent fails signify bad network connections
 *
 * Current measures:
 *
 * 1. Caching results to fs
 * 2. Retries on fail
 * 3. Reduced network timeouts to speed up retries
 *
 */

const maxRetries = 50
const read_timeout = 3000 // ms
const response_timeout = 3000 // ms

const calcHash = async (input: ArrayBuffer | string) => await sha1(input)

const genCacheKey = async (url: string, noCache?: boolean) => {
  if (noCache) return null
  return await calcHash(url)
}

export interface Dimensions {
  width: number
  height: number
}

const tryProbeImage = async (path: string, cacheKey: string | null): Promise<Dimensions | null> => {
  const { width, height } = await probe(fs.createReadStream(path))
  setCache(cacheKey, { width, height })
  return { width, height }
}

export const imageDimensions = async (url: string | undefined | null, noCache?: boolean): Promise<Dimensions | null> => {
  if (!url) return null

  const cacheKey = await genCacheKey(url, noCache)
  const cached = getCache<Dimensions>(cacheKey)
  if (cached) return cached

  let width = 0
  let height = 0

  let hasError: boolean
  let retry = 0

  let reader: string | NodeJS.ReadableStream = url

  let file = join(imageRoot, url)
  if (fs.existsSync(file)) {
    return tryProbeImage(file, cacheKey)
  }

  do {
    try {
      const { width: w, height: h } = await probe(url, {
        read_timeout,
        response_timeout,
      })
      width = w
      height = h
      hasError = false
    } catch (e) {
      const error = e as { code: string }
      const { code } = error

      hasError = true
      retry = retry + 1

      if (code === 'ECONTENT') {
        // no content: width + height = 0
        hasError = false
      }
      if (!['ECONNRESET', 'ECONTENT'].includes(code)) {
        console.warn(`images.ts: Error while probing image with url: ${url}.`)
        // throw e
        return null
      }
    }
  } while (hasError && retry < maxRetries)
  // if (hasError) throw new Error(`images.ts: Bad network connection. Failed image probe after ${maxRetries} retries for url: ${url}.`)
  if (hasError) {
    console.log(`images.ts: Bad network connection. Failed image probe after ${maxRetries} retries for url: ${url}.`)
    return null
  }

  if (0 === width + height) return null

  setCache(cacheKey, { width, height })
  return { width, height }
}

export const imageDimensionsFromFile = async (file: string, noCache?: boolean) => {
  if (!file) return null

  const cacheKey = await genCacheKey(file, noCache)
  const cached = getCache<Dimensions>(cacheKey)
  if (cached) return cached

  const { width, height } = await probe(createReadStream(file))
  if (0 === width + height) return null

  setCache(cacheKey, { width, height })
  return { width, height }
}

// /**
//  * If the sourceImage flag is set, stream images
//  * from localhost to the public image folder
//  */
