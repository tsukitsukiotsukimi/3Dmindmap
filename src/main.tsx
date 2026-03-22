import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'

try {
  const root = document.getElementById('root')
  if (!root) throw new Error('Root element not found')

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (err) {
  const loader = document.getElementById('app-loader')
  if (loader) {
    loader.innerHTML = `
      <div style="color:#e74c3c;font-size:16px">アプリの起動に失敗しました</div>
      <div style="font-size:12px;color:#a0a0b0;max-width:400px;text-align:center">${err instanceof Error ? err.message : String(err)}</div>
      <button onclick="location.reload()" style="padding:8px 16px;background:#4a90d9;color:#fff;border:none;border-radius:4px;cursor:pointer">再読み込み</button>
    `
  }
}
