import type { DictionaryEntry } from "../dictionary/types";

// TODO:íclean up the origin dictionary data to remove this part of code
// Transfer the null or undefiend value to empty string
function toSafeText(value: unknown): string {
  if (value == null || value === undefined) return "";
  try {
    return String(value).trim();
  } catch {
    return "";
  }
}

// Transfer the example filed to string list
function normalizeExample(vaule: unknown): string[] {
  if (Array.isArray(vaule)) {
    return vaule.map((item) => toSafeText(item)).filter(Boolean);
  }
  const text = toSafeText(vaule);
  return text ? [text] : [];
}

// Normalize each field in the dictionary entry
export function normalizeDictionaryEntry(raw: unknown): DictionaryEntry {
  const entry = raw as Record<string, unknown>;
  const word = toSafeText(entry.word);
  const normalizedWord: DictionaryEntry = {
    word: word,
    type: toSafeText(entry.type),
    meaning: toSafeText(entry.meaning),
    ord: toSafeText(entry.meaning),
    examples: normalizeExample(entry.examples),
    level: toSafeText(entry.level),
  };

  if ("inflection" in entry) {
    if (typeof entry.inflection === "string") {
      normalizedWord.inflection = entry.inflection.trim();
    } else if (Array.isArray(entry.inflection)) {
      normalizedWord.inflection = entry.inflection
        .map((item) => toSafeText(item))
        .filter(Boolean)
        .join("; ");
    } else if (entry.inflection && typeof entry.inflection === "object") {
      normalizedWord.inflection = JSON.stringify(entry.inflection);
    } else {
      normalizedWord.inflection = "";
    }
  }
  return normalizedWord;
}
