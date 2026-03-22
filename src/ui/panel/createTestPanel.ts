export function createTestPanel() {
  if (document.getElementById('nh-test-trigger')) return

  const btn = document.createElement('button')
  btn.id = 'nh-test-trigger'
  btn.className = 'nh-manager-trigger'
  btn.textContent = '插件已加载'

  btn.addEventListener('click', () => {
    console.log('[Rebuild] test trigger clicked')
    alert('Vite + Vanilla + TypeScript 插件骨架运行成功')
  })

  document.body.appendChild(btn)
}