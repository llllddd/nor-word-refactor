import { WORD_PATTERN } from "./wordPattern";

export interface TextToken {
  word: string;
  start: number;
  end: number;
}

// Scan the webpage record the start info and end info of each word as token
export function tokenizeText(
  text: string,
  wordPattern: RegExp = WORD_PATTERN,
): TextToken[] {
  const tokenRegex = new RegExp(wordPattern.source, wordPattern.flags);
  const tokens: TextToken[] = [];
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    tokens.push({
      word: match[0].toLowerCase(),
      start: match.index,
      end: tokenRegex.lastIndex,
    });
  }
  return tokens;
}
