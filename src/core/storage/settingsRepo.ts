import { STORAGE_KEYS } from './keys'

function getChromeStorage(): chrome.storage.StorageArea {
  return chrome.storage.local
}

async function getStringArray(key: string): Promise<string[]> {
  const result = await getChromeStorage().get(key)
  const value = result[key]

  if (!Array.isArray(value)) return []

  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
}

async function setStringArray(key: string, values: Iterable<string>): Promise<void> {
  const uniqueValues = Array.from(new Set(Array.from(values).map((item) => item.trim()).filter(Boolean)))
  await getChromeStorage().set({
    [key]: uniqueValues
  })
}

export async function loadDisabledWords(): Promise<Set<string>> {
  const items = await getStringArray(STORAGE_KEYS.disabledWords)
  return new Set(items)
}

export async function saveDisabledWords(words: Set<string>): Promise<void> {
  await setStringArray(STORAGE_KEYS.disabledWords, words)
}

export async function loadNewWords(): Promise<Set<string>> {
  const items = await getStringArray(STORAGE_KEYS.newWords)
  return new Set(items)
}

export async function saveNewWords(words: Set<string>): Promise<void> {
  await setStringArray(STORAGE_KEYS.newWords, words)
}