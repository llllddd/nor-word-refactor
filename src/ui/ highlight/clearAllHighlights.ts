import { HIGHLIGHT_CLASS, INLINE_MEANING_CLASS } from './constants'

export function clearAllHighlights() {
  document.querySelectorAll(`.${INLINE_MEANING_CLASS}`).forEach((el) => {
    el.remove()
  })

  document.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`).forEach((mark) => {
    mark.replaceWith(document.createTextNode(mark.textContent || ''))
  })
}