import type { DictionaryEntry } from "../dictionary/types";
import { getDictionaryEntryKey } from "./getDictionaryEntryKey";

export function mergeCustomEntries(
  existingEntries: DictionaryEntry[],
  incomingEntries: DictionaryEntry[],
): number {
  const seen = new Set(
    existingEntries
      .map((entry) => getDictionaryEntryKey(entry))
      .filter(Boolean),
  );
  let addedCount = 0;
  for (const entry of incomingEntries) {
    const key = getDictionaryEntryKey(entry);
    if (!key || seen.has(key)) continue;

    seen.add(key);
    existingEntries.push(entry);
    addedCount += 1;
  }
  return addedCount;
}
