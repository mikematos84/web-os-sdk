import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { initialize } from '@web-os/core'

// Initialize WebOS SDK
initialize({ theme: 'light' })
  .then(() => {
    // Do something with the WebOS SDK
  }).catch((error) => {
    console.error('Failed to initialize WebOS SDK:', error);
  }); 

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="padding-top: 60px;">
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
