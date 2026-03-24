import { loadAllDictionaries } from '../core/dictionary/loadDictionary'
import { normalizeDictionaryEntry } from '../core/text/normalizeDictEntry'
import { buildMatcher } from '../core/matcher/buildMatcher'
import { WORD_PATTERN } from '../core/text/wordPattern'
import { clearAllHighlights } from '../ui/highlight/clearAllHighlights'
import { highlightText } from '../ui/highlight/highlightText'
import { createTestPanel } from '../ui/panel/createTestPanel'
import { loadDisabledWords, loadNewWords, saveDisabledWords, saveNewWords } from '../core/storage/settingsRepo'
import { setupTooltipInteractions } from '../ui/tooltip/setupTooltipInteractions'

export interface AppController {
  init(): Promise<void>
  refreshHighlights(): void
  disableWord(word: string): Promise<void>
  enableWord(word: string): Promise<void>
  addNewWord(word: string): Promise<void>
  removeNewWord(word: string): Promise<void>
  isDisabledWord(word: string): boolean
  isNewWord(word: string): boolean
}

export function createAppController(): AppController {
  let dictionaryData: ReturnType<typeof buildMatcher> | null = null
  let normalizedEntries: Array<NonNullable<ReturnType<typeof normalizeDictionaryEntry>>> = []
  let disabledWords = new Set<string>()
  let newWords = new Set<string>()

  function isDisabledWord(word: string): boolean {
    return disabledWords.has(word)
  }

  function isNewWord(word: string): boolean {
    return newWords.has(word)
  }

  function refreshHighlights() {
    if (!dictionaryData && normalizedEntries.length === 0) return

    const matcher = buildMatcher(normalizedEntries, disabledWords, new Set(), WORD_PATTERN)

    clearAllHighlights()
    const pageStats = highlightText(document.body, matcher, WORD_PATTERN, newWords)

    console.log('[Rebuild] page refreshed', {
      dictionarySize: normalizedEntries.length,
      matcherSize: matcher.size,
      pageMatchedTotal: pageStats,
      disabledWords: disabledWords.size,
      newWords: newWords.size
    })

    createTestPanel(`命中:${pageStats} 生词:${newWords.size}`)
  }

  async function disableWord(word: string) {
    disabledWords.add(word)
    await saveDisabledWords(disabledWords)
    refreshHighlights()
  }

  async function enableWord(word: string) {
    disabledWords.delete(word)
    await saveDisabledWords(disabledWords)
    refreshHighlights()
  }

  async function addNewWord(word: string) {
    newWords.add(word)
    await saveNewWords(newWords)
    refreshHighlights()
  }

  async function removeNewWord(word: string) {
    newWords.delete(word)
    await saveNewWords(newWords)
    refreshHighlights()
  }

  return {
    async init() {
      console.log('[Rebuild] app init')

      const dictionaries = await loadAllDictionaries()

      normalizedEntries = dictionaries.main
        .map((item) => normalizeDictionaryEntry(item))
        .filter((item): item is NonNullable<typeof item> => item !== null)

      disabledWords = await loadDisabledWords()
      newWords = await loadNewWords()

      dictionaryData = buildMatcher(normalizedEntries, disabledWords, new Set(), WORD_PATTERN)

      refreshHighlights()
      setupTooltipInteractions({
        disableWord,
        enableWord,
        addNewWord,
        removeNewWord,
        isDisabledWord,
        isNewWord
      })
    },

    refreshHighlights,
    disableWord,
    enableWord,
    addNewWord,
    removeNewWord,
    isDisabledWord,
    isNewWord
  }
}