import { WORD_PATTERN } from "./wordPattern";

// Remove the special punctuations and make the value the normal phrase
export function normalizePhrase(value: unknown): string {
  if (value == null || value === undefined) return "";

  const text = String(value)
    .toLocaleLowerCase()
    .replace(/\([^)]*\)/g, " ") // Remove ()
    .replace(/[\/,;]+/g, " ") // remove specific punctuations
    .replace(/\s+/g, " ") // remove double space
    .trim(); // remove space at the beginning and ending of a string
  return text;
}

// Normalize the phrase to tokens with the supplied regex pattern
export function normalizePhraseWithPattern(
  value: unknown,
  wordPattern: RegExp = WORD_PATTERN,
): string {
  if (value == null || value === undefined) return "";

  const cleaned = String(value)
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ");
  const tokens = cleaned.match(wordPattern);
  if (!tokens || tokens.length === 0) return "";
  // Keep token boundaries so phrase matching logic can split by spaces.
  return tokens.join(" ");
}
