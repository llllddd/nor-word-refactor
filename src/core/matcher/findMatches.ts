import { tokenizeText } from '../text/tokenizeText'
import { WORD_PATTERN } from '../text/wordPattern'
import type { Matcher, TextMatch } from './types'

export function findMatches(
  text: string,
  matcher: Matcher,
  wordPattern: RegExp = WORD_PATTERN
): TextMatch[] {
  const tokens = tokenizeText(text, wordPattern)
  if (tokens.length === 0) return []

  const matches: TextMatch[] = []
  let i = 0

  while (i < tokens.length) {
    const token = tokens[i]
    const firstTokenMap = matcher.index.get(token.word)

    if (!firstTokenMap) {
      i += 1
      continue
    }

    let matched = false

    for (const phraseLength of firstTokenMap.lengthsDesc) {
      if (i + phraseLength > tokens.length) continue

      const phrase = tokens
        .slice(i, i + phraseLength)
        .map((entry) => entry.word)
        .join(' ')

      const entry = firstTokenMap.byLength.get(phraseLength)?.get(phrase)
      if (!entry) continue

      matches.push({
        start: tokens[i].start,
        end: tokens[i + phraseLength - 1].end,
        meaning: entry.meaning || '',
        type: entry.type || '',
        inflection: entry.inflection || '',
        baseWord: entry.baseWord || '',
        ord: entry.ord || '',
        examples: entry.examples || [],
        level: entry.level || ''
      })

      i += phraseLength
      matched = true
      break
    }

    if (!matched) {
      i += 1
    }
  }

  return matches
}