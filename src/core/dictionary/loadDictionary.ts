import type { DictionaryList } from "./types";

export const NOR_DICTIONARY_URL = chrome.runtime.getURL("wordsdetail.json");
export const NOR_OWN_URL = chrome.runtime.getURL("myown.json");

// Read wordsdctionary from the json file
export async function loadDictionary(url: string): Promise<DictionaryList> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch ${url}");
    }
    const dictionaryData = response.json();
    return dictionaryData;
  } catch (error) {
    return [];
  }
}

// Load dictionary list
export async function loadAllDictionaries() {
  const [main, myown] = await Promise.all([
    loadDictionary(NOR_DICTIONARY_URL),
    loadDictionary(NOR_OWN_URL),
  ]);
  return { main, myown };
}
