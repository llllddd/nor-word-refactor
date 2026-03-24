import { HIGHLIGHT_CLASS, TOOLTIP_CLASS } from "../highlight/constants";
import { createTooltip } from "./createTooltip";

interface TooltipActions {
  disableWord(word: string): Promise<void>;
  enableWord(word: string): Promise<void>;
  addNewWord(word: string): Promise<void>;
  removeNewWord(word: string): Promise<void>;
  isDisabledWord(word: string): boolean;
  isNewWord(word: string): boolean;
}

export function setupTooltipInteractions(actions: TooltipActions) {
  const tooltip = createTooltip()
  let currentNormalizedWord = ''
  
  const disableBtn = tooltip.querySelector(
    ".no-tooltip-disable-btn",
  ) as HTMLButtonElement;
  const newWordBtn = tooltip.querySelector(
    ".no-tooltip-newword-btn",
  ) as HTMLButtonElement;
  function hideTooltip() {
    tooltip.style.display = "none";
  }

  function updateActionButtons() {
    if (!currentNormalizedWord) return;

    disableBtn.textContent = actions.isDisabledWord(currentNormalizedWord)
      ? "恢复高亮"
      : "禁用高亮";

    newWordBtn.textContent = actions.isNewWord(currentNormalizedWord)
      ? "移出生词本"
      : "加入生词本";
  }

  function showTooltip(target: HTMLElement) {
    const rect = target.getBoundingClientRect();

    const word = target.textContent || "";
    const meaning = target.dataset.meaning || "";
    const type = target.dataset.type || "";
    const inflection = target.dataset.inflection || "";

    tooltip.querySelector(".no-tooltip-word")!.textContent = word;
    tooltip.querySelector(".no-tooltip-type")!.textContent = type;
    tooltip.querySelector(".no-tooltip-meaning")!.textContent = meaning;
    tooltip.querySelector(".no-tooltip-inflection")!.textContent = inflection;

    updateActionButtons()
    tooltip.style.display = "block";

    const top = rect.bottom + window.scrollY + 6;
    const left = rect.left + window.scrollX;

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  // hover 高亮词显示 tooltip
  document.addEventListener("mouseover", (e) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;

    const mark = target.closest(`.${HIGHLIGHT_CLASS}`) as HTMLElement | null;
    if (!mark) return;

    showTooltip(mark);
  });

 disableBtn.addEventListener('click', async (e) => {
    e.stopPropagation()
    if (!currentNormalizedWord) return

    if (actions.isDisabledWord(currentNormalizedWord)) {
      await actions.enableWord(currentNormalizedWord)
    } else {
      await actions.disableWord(currentNormalizedWord)
    }

    hideTooltip()
  })

  newWordBtn.addEventListener('click', async (e) => {
    e.stopPropagation()
    if (!currentNormalizedWord) return

    if (actions.isNewWord(currentNormalizedWord)) {
      await actions.removeNewWord(currentNormalizedWord)
    } else {
      await actions.addNewWord(currentNormalizedWord)
    }

    hideTooltip()
  })

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement

    if (target.classList.contains(HIGHLIGHT_CLASS)) {
      e.stopPropagation()
      showTooltip(target)
      return
    }

    if (!target.closest(`.${TOOLTIP_CLASS}`)) {
      hideTooltip()
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideTooltip()
    }
  })

  window.addEventListener('scroll', hideTooltip, true)
}