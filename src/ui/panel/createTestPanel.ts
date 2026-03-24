export function createTestPanel(text = '插件已加载') {
  const existing = document.getElementById('nh-test-trigger') as HTMLButtonElement | null

  if (existing) {
    existing.textContent = text
    return
  }

  const btn = document.createElement('button')
  btn.id = 'nh-test-trigger'
  btn.className = 'nh-manager-trigger'
  btn.textContent = text

  btn.addEventListener('click', () => {
    console.log('[Rebuild] test trigger clicked')
    alert('插件运行正常')
  })

  document.body.appendChild(btn)
}