import { HIGHLIGHT_CLASS, TOOLTIP_CLASS } from '../ highlight/constants'
import { createTooltip } from './createTooltip'

export function setupTooltipInteractions() {
  const tooltip = createTooltip()

  function hideTooltip() {
    tooltip.style.display = 'none'
  }

  function showTooltip(target: HTMLElement) {
    const rect = target.getBoundingClientRect()

    const word = target.textContent || ''
    const meaning = target.dataset.meaning || ''
    const type = target.dataset.type || ''
    const inflection = target.dataset.inflection || ''

    tooltip.querySelector('.no-tooltip-word')!.textContent = word
    tooltip.querySelector('.no-tooltip-type')!.textContent = type
    tooltip.querySelector('.no-tooltip-meaning')!.textContent = meaning
    tooltip.querySelector('.no-tooltip-inflection')!.textContent = inflection

    tooltip.style.display = 'block'

    const top = rect.bottom + window.scrollY + 6
    const left = rect.left + window.scrollX

    tooltip.style.top = `${top}px`
    tooltip.style.left = `${left}px`
  }

  // hover 高亮词显示 tooltip
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement | null
    if (!target) return

    const mark = target.closest(`.${HIGHLIGHT_CLASS}`) as HTMLElement | null
    if (!mark) return

    showTooltip(mark)
  })

  // 鼠标离开高亮词且没有进入 tooltip 时关闭
  document.addEventListener('mouseout', (e) => {
    const target = e.target as HTMLElement | null
    const next = e.relatedTarget as HTMLElement | null
    if (!target) return

    const leavingMark = target.closest(`.${HIGHLIGHT_CLASS}`)
    if (!leavingMark) return

    const enteringMark = next?.closest(`.${HIGHLIGHT_CLASS}`)
    const enteringTooltip = next?.closest(`.${TOOLTIP_CLASS}`)
    if (enteringMark || enteringTooltip) return

    hideTooltip()
  })

  // tooltip 外点击关闭
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest(`.${TOOLTIP_CLASS}`) && !target.closest(`.${HIGHLIGHT_CLASS}`)) {
      hideTooltip()
    }
  })

  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideTooltip()
    }
  })

  // 滚动时关闭
  window.addEventListener('scroll', hideTooltip, true)
}
