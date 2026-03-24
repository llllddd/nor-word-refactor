// Transfer the string, array, obeject of the Inflection field to the string split by comma
export function normalizeInflection(rawInflect: unknown): string {
  if (typeof rawInflect === "string") {
    return rawInflect.trim();
  }

  if (Array.isArray(rawInflect)) {
    return rawInflect
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(", ");
  }

  if (rawInflect && typeof rawInflect === "object") {
    return Object.values(rawInflect as Record<string, unknown>)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(", ");
  }
  return "";
}
