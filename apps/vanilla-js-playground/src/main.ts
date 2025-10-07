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

    // Create app bar
    webOsCore.createAppBar('#app', { theme: 'light' });
    
    // Create a sample window
    const window = webOsCore.createWindow({ 
      title: 'WebOS Window', 
      width: 400, 
      height: 300 
    });
    
    // Add some content to the window
    const content = window.querySelector('div:last-child');
    if (content) {
      content.innerHTML = `
        <h3>Welcome to WebOS!</h3>
        <p>This is a vanilla JavaScript implementation of the WebOS SDK.</p>
        <button id="window-counter" type="button">Click me!</button>
      `;
      
      // Setup counter in the window
      const windowCounter = content.querySelector('#window-counter') as HTMLButtonElement;
      if (windowCounter) {
        setupCounter(windowCounter);
      }
    }
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
    <p class="read-the-docs">
      WebOS SDK running in vanilla JavaScript environment
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

// Initialize WebOS after DOM is ready
initWebOS();
