import '../styles/main.css'
import { createAppController } from '../app/createAppController'

function bootstrap() {
  console.log('[Rebuild] content script loaded')
  const app = createAppController()
  app.init()
}

bootstrap()