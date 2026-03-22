export function createTestPanel(text = 'extension loaded') {
  if (document.getElementById('nh-test-trigger')) return

  const btn = document.createElement('button')
  btn.id = 'nh-test-trigger'
  btn.className = 'nh-manager-trigger'
  btn.textContent = text

  btn.addEventListener('click', () => {
    console.log('[Rebuild] test trigger clicked')
  })

  document.body.appendChild(btn)
}