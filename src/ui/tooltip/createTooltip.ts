import { TOOLTIP_CLASS } from '../ highlight/constants'

let tooltipEl: HTMLDivElement | null = null
//创建tooltipDOM
export function createTooltip() {
  if (tooltipEl) return tooltipEl

  tooltipEl = document.createElement('div')
  tooltipEl.className = TOOLTIP_CLASS
  tooltipEl.style.display = 'none'

  tooltipEl.innerHTML = `
    <div class="no-tooltip-content">
      <div class="no-tooltip-word"></div>
      <div class="no-tooltip-type"></div>
      <div class="no-tooltip-meaning"></div>
      <div class="no-tooltip-inflection"></div>
    </div>
  `

  document.body.appendChild(tooltipEl)

  return tooltipEl
}