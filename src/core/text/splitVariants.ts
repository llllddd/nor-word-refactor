// Split the pharse according to the punctuations , ; , : /

export function splitVariants(raw: unknown): string[] {
  if (!raw) return [];
  return String(raw)
    .split(/[,;，；/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}
