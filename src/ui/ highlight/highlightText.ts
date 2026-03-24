import { findMatches } from '../../core/matcher/findMatches'
import { normalizePhraseWithPattern } from '../../core/text/normalizePhrase'
import type { Matcher, TextMatch } from '../../core/matcher/types'
import type { MarkExtraInfo } from './types'
import {
  HIGHLIGHT_CLASS,
  INLINE_MEANING_CLASS,
  MANAGER_CLASS,
  TOOLTIP_CLASS
} from './constants'

export const MARK_EXTRA_INFO = new WeakMap<HTMLElement, MarkExtraInfo>()

type HighlightJob = {
  node: Text
  matches: TextMatch[]
}

const BLOCKED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'])

//判断这个文本节点是否需要跳过
function isSkippableTextNode(node: Node): boolean {
  const parent = node.parentElement
  if (!parent) return true

  const isBlockedTag = BLOCKED_TAGS.has(parent.tagName)
  const insideHighlight = Boolean(parent.closest(`mark.${HIGHLIGHT_CLASS}`))
  const insideManager = Boolean(parent.closest(`.${MANAGER_CLASS}`))
  const insideTooltip = Boolean(parent.closest(`.${TOOLTIP_CLASS}`))
  const rawText = node.nodeValue ?? ''
  const isEmptyText = rawText.trim().length === 0

  return isBlockedTag || insideHighlight || insideManager || insideTooltip || isEmptyText
}

//扫描页面文本手机需要高亮的任务列表
function collectHighlightJobs(
  root: ParentNode,
  matcher: Matcher,
  wordPattern: RegExp
): HighlightJob[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      return isSkippableTextNode(node)
        ? NodeFilter.FILTER_REJECT
        : NodeFilter.FILTER_ACCEPT
    }
  })

  const jobs: HighlightJob[] = []

  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const matches = findMatches(node.nodeValue ?? '', matcher, wordPattern)
    if (matches.length > 0) {
      jobs.push({ node, matches })
    }
  }

  return jobs
}

//给每个高亮出来的 mark 元素“挂信息 + 可访问性属性”
function attachMarkMetadata(mark: HTMLElement, match: TextMatch): void {
  mark.dataset.meaning = match.meaning || ''
  mark.dataset.type = match.type || ''
  mark.dataset.inflection = match.inflection || ''
  mark.dataset.baseWord = match.baseWord || ''
  mark.dataset.ord = match.ord || ''
  mark.dataset.level = String(match.level || '')

  MARK_EXTRA_INFO.set(mark, {
    description: (match as TextMatch & { description?: string }).description || '',
    examples: Array.isArray(match.examples) ? match.examples : []
  })

  mark.tabIndex = 0
  mark.setAttribute('role', 'button')
  mark.setAttribute('aria-label', `查看释义: ${mark.textContent}`)
}

//单词后追加行内释义
function appendInlineMeaningIfNeeded(
  fragment: DocumentFragment,
  highlightedText: string,
  match: TextMatch,
  newWords: Set<string>,
  wordPattern: RegExp
): void {
  const normalizedWord = normalizePhraseWithPattern(highlightedText, wordPattern)

  if (!normalizedWord || !newWords.has(normalizedWord) || !match.meaning) {
    return
  }

  const inlineMeaning = document.createElement('span')
  inlineMeaning.className = INLINE_MEANING_CLASS
  inlineMeaning.textContent = ` ${match.meaning}`
  fragment.appendChild(inlineMeaning)
}

export function highlightText(
  root: ParentNode,
  matcher: Matcher,
  wordPattern: RegExp,
  newWords: Set<string> = new Set()
): number {
  const jobs = collectHighlightJobs(root, matcher, wordPattern)

  jobs.forEach(({ node, matches }) => {
    const parent = node.parentNode
    if (!parent) return

    const text = node.nodeValue ?? ''
    const fragment = document.createDocumentFragment()
    let lastIndex = 0

    matches.forEach((match) => {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.start)))

      const highlightedText = text.slice(match.start, match.end)
      const mark = document.createElement('mark')
      mark.className = `${HIGHLIGHT_CLASS} no-highlight-level-${match.level}`
      mark.textContent = highlightedText

      attachMarkMetadata(mark, match)
      fragment.appendChild(mark)

      appendInlineMeaningIfNeeded(fragment, highlightedText, match, newWords, wordPattern)
      lastIndex = match.end
    })

    fragment.appendChild(document.createTextNode(text.slice(lastIndex)))
    parent.replaceChild(fragment, node)
  })
  const total = jobs.length
  return total
}
