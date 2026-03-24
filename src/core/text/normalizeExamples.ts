export interface NormalizedExample {
  no: string;
  en: string;
}

// Require examples to be an array including `no` and/or `en` fields
export function normalizeExamples(rawExamples: unknown): NormalizedExample[] {
  if (!Array.isArray(rawExamples)) return [];
  return rawExamples
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const no = record.no ? String(record.no).trim() : "";
      const en = record.en ? String(record.en).trim() : "";

      if (!no && !en) return null;
      return { no, en };
    })
    .filter((item): item is NormalizedExample => item !== null);
}
