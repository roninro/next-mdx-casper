import { getLang, get } from '@utils/use-lang'
import { SubscribeForm } from '@components/SubscribeForm'
import { Settings } from '@lib/get-settings'

// TODO: delete the file and related code when the component is deleted
export const Subscribe = ({ settings }: { settings: Settings }) => {
  const text = get(getLang(settings.lang))
  const title = text(`SITE_TITLE`, settings.title)

  return (
    <section className="subscribe-form">
      <h3 className="subscribe-form-title">
        {text(`SUBSCRIBE_TO`)} {title}
      </h3>
      <p className="subscribe-form-description">{text(`SUBSCRIBE_SECTION`)}</p>
      <SubscribeForm {...{ settings }} />
    </section>
  )
}
