import { useTheme } from '@components/contexts/themeProvider'
import { useCallback, useEffect, useState } from 'react'
import React from 'react'
import { getLang, get } from '@utils/use-lang'

interface GiscusCommentsProps {
  repo?: string
  repoId?: string
  category?: string
  categoryId?: string
  mapping?: string
  term?: string
  lang?: string
  reactionsEnabled?: boolean
}


export const Giscus = ({
  repo,
  repoId,
  category,
  categoryId,
  mapping,
  lang,
  reactionsEnabled,
}: GiscusCommentsProps) => {
  const text = get(getLang(lang))

  const { getDark } = useTheme()
  const dark = getDark()
  const commentsTheme = dark === 'dark' ? 'dark_dimmed' : 'light'

  const COMMENTS_ID = 'comments-container'

  const [enableLoadComments, setEnabledLoadComments] = useState(true)

  // useEffect(() => {
  //   LoadComments()
  // }, []);

  useEffect(() => {
    
    const data = {
      setConfig: {
        theme: commentsTheme,
      },
    };

    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    if (!iframe) return
    iframe.contentWindow?.postMessage({ giscus: data }, "https://giscus.app");

  }, [commentsTheme])

  const LoadComments = useCallback(() => {
    setEnabledLoadComments(false)
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', repo!)
    script.setAttribute('data-repo-id', repoId!)
    script.setAttribute('data-category', category || '')
    script.setAttribute('data-category-id', categoryId || '')
    script.setAttribute('data-mapping', mapping!)
    script.setAttribute('data-reactions-enabled', reactionsEnabled ? '1' : '0')
    script.setAttribute('data-emit-metadata', '1')
    script.setAttribute('data-theme', commentsTheme)
    script.setAttribute('data-lang', lang || 'en')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    const comments = document.getElementById(COMMENTS_ID)
    if (comments) comments.appendChild(script)

    return () => {
      const comments = document.getElementById(COMMENTS_ID)
      if (comments) comments.innerHTML = ''
    }
  }, [commentsTheme])

  return (
    <div className='post-full-comments'>
      {enableLoadComments && <button onClick={LoadComments}>{text(`LOAD_COMMENTS`)}</button>}
      <div className="giscus" id={COMMENTS_ID} />
    </div>
  )
}
