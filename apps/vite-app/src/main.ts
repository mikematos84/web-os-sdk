import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { initialize } from '@web-os/core'

// Initialize WebOS SDK
let webOsCore: any = null;

async function initWebOS() {
  try {
    webOsCore = await initialize({ theme: 'light' });

    // Create app bar (now includes integrated info panel button)
    webOsCore.createAppBar('#app', { theme: 'light' });
    
  } catch (error) {
    // Error logging is handled by the core initialize function
  }
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>WebOS + Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// Initialize WebOS after DOM is ready
initWebOS();
