import { normalizePhrase } from "./normalizePhrase";
import type { DictionaryEntry } from "../dictionary/types";
//TODO:add this key field in the origin dictionary data
// Safe transfer string to the lowercase
function toSafeLowerText(value: unknown): string {
  if (value == null || typeof value === undefined) return "";
  try {
    return String(value).trim().toLowerCase();
  } catch {
    return "";
  }
}

// Get the key for each word : word|type|meaning
export function getDictionaryEntryKey(entry: DictionaryEntry): string {
  try {
    const word = normalizePhrase(entry.word);
    if (!word) return "";
    const type = toSafeLowerText(entry.type);
    const meaning = toSafeLowerText(entry.meaning);
    return `${word}|${type}|${meaning}`;
  } catch (error) {
    console.warn("neglect invalid word key");
    return "";
  }
}
