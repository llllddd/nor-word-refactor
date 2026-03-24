import type { DictionaryEntry } from "../dictionary/types";
import { normalizePhraseWithPattern } from "../text/normalizePhrase";
import { WORD_PATTERN } from "../text/wordPattern";
import type { Matcher, MatchedEntry, FirstTokenMap } from "./types";
import { normalizeInflection } from "../text/normalizeInflection";
import {
  normalizeExamples,
  type NormalizedExample,
} from "../text/normalizeExamples";
import { splitVariants } from "../text/splitVariants";

// 把词典数据处理成一个快速匹配索引
export function buildMatcher(
  data: DictionaryEntry[],
  disabledWords: Set<string> = new Set(),
  disabledLevels: Set<string> = new Set(),
  wordPattern: RegExp = WORD_PATTERN,
): Matcher {
  const index = new Map<string, FirstTokenMap>();
  let size = 0;

  function addPhrase(
    rawPhrase: unknown,
    meaning: string,
    type: string,
    inflection: string,
    baseWord: string,
    ord: string,
    level: string,
    examples: NormalizedExample[],
  ) {
    const normalized = normalizePhraseWithPattern(rawPhrase, wordPattern);
    if (!normalized) return;
    if (disabledWords.has(normalized)) return;
    if (disabledLevels.has(level)) return;

    const tokens = normalized.split(" ");
    const firstToken = tokens[0];
    const phraseLength = tokens.length;

    let firstTokenMap = index.get(firstToken);
    if (!firstTokenMap) {
      firstTokenMap = {
        byLength: new Map(),
        lengthsDesc: [],
      };
      index.set(firstToken, firstTokenMap);
    }

    let phrases = firstTokenMap.byLength.get(phraseLength);
    if (!phrases) {
      phrases = new Map<string, MatchedEntry>();
      firstTokenMap.byLength.set(phraseLength, phrases);
      firstTokenMap.lengthsDesc.push(phraseLength);
      firstTokenMap.lengthsDesc.sort((a, b) => b - a);
    }
    if (phrases.has(normalized)) return;

    phrases.set(normalized, {
      meaning: meaning || '',
      type: type || '',
      inflection: inflection || '',
      baseWord: baseWord || '',
      ord: ord || '',
      examples,
      level,
    });
    size += 1;
  }

  data.forEach((item) => {
    const meaning = item.meaning || "";
    const type = item.type || "";
    const inflection = normalizeInflection(item.inflection);
    const examples = normalizeExamples(item.examples);
    const baseWord = item.word || "";
    const ord = item.ord || "";
    const level = item.level || "";
    const baseWordVariants = splitVariants(baseWord);
    //TODO:Remove this judgement
    if (baseWordVariants.length > 0) {
      baseWordVariants.forEach((variant) => {
        addPhrase(
          variant,
          meaning,
          type,
          inflection,
          baseWord,
          ord,
          level,
          examples,
        );
      });
    } else {
      addPhrase(
        baseWord,
        meaning,
        type,
        inflection,
        baseWord,
        ord,
        level,
        examples,
      );
    }

    if (inflection) {
      const inflectionVariants = splitVariants(inflection); 
      inflectionVariants.forEach((variant) => {
        addPhrase(
          variant,
          meaning,
          type,
          inflection,
          baseWord,
          ord,
          level,
          examples,
        );

        const normalizedVariant = normalizePhraseWithPattern(variant, wordPattern);
        if (normalizedVariant.includes(" ")) {
          const tokens = normalizedVariant.split(" ");
          const tailToken = tokens[tokens.length - 1];
          addPhrase(
            tailToken,
            meaning,
            type,
            inflection,
            baseWord,
            ord,
            level,
            examples,
          );
        }
      });
    }
  });

  return { index, size };
}
