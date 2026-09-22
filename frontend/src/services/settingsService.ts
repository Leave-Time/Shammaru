export type Settings = {
  theme: "system" | "light" | "dark";
  autoSave: boolean;
  defaultProjectDir: string;
  editorFontSize: number;
};
export const defaultSettings: Settings = {
  theme: "system",
  autoSave: true,
  defaultProjectDir: "",
  editorFontSize: 14,
};
const storageKey = "shammaru.settings";
export async function getSettings(): Promise<Settings> {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const value = JSON.parse(
      window.localStorage.getItem(storageKey) ?? "{}",
    ) as Partial<Settings>;
    return {
      ...defaultSettings,
      ...value,
      theme: value.theme ?? defaultSettings.theme,
    };
  } catch {
    return defaultSettings;
  }
}
export async function saveSettings(value: Settings) {
  if (typeof window !== "undefined")
    window.localStorage.setItem(storageKey, JSON.stringify(value));
}
