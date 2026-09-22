import { GetSettings, SaveSettings } from '../../wailsjs/go/main/App'
export type Settings = { theme: 'system' | 'light' | 'dark'; autoSave: boolean; defaultProjectDir: string; editorFontSize: number }
export const defaultSettings: Settings = { theme: 'system', autoSave: true, defaultProjectDir: '', editorFontSize: 14 }
const hasBridge = () => typeof window !== 'undefined' && Boolean((window as Window & { go?: unknown }).go)
export async function getSettings(): Promise<Settings> {
  if (!hasBridge()) return defaultSettings
  const value = await GetSettings()
  return { ...defaultSettings, ...value, theme: value.theme as Settings['theme'] }
}
export async function saveSettings(value: Settings) { if (hasBridge()) await SaveSettings(value) }
