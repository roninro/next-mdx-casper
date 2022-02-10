import { DarkModeToggle } from '@components/DarkModeToggle'
import { Settings } from '@lib/get-settings'

interface DarkModeProps {
  settings: Settings
}

export const DarkMode = ({ settings }: DarkModeProps) => {
  const { darkMode } = settings
  if (darkMode.defaultMode === null) return null
  return <DarkModeToggle {...{ lang: settings.lang }} />
}
