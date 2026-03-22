export function normalizePhrase(value: unknown): string {
  if (value == null || value === undefined) return ""

  const text = String(value)
    .toLocaleLowerCase()
    .replace(/\([^)]*\)/g, " ") // Remove ()
    .replace(/[\/,;]+/g, " ") // remove specific punctuations
    .replace(/\s+/g, " ") // remove double space
    .trim(); // remove space at the beginning and ending of a string
  return text
}
