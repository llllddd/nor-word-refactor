import { createTestPanel } from '../ui/panel/createTestPanel'

export function createAppController() {
  return {
    init() {
      console.log('[Rebuild] app init')
      createTestPanel()
    }
  }
}