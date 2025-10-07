# @web-os/core

A universal WebOS SDK that works in both React and vanilla JavaScript environments with a single import.

## Installation

```bash
pnpm add @web-os/core
```

## Usage

### React/Next.js

```tsx
import { initialize, WebOsAppBar } from '@web-os/core';

function App() {
  useEffect(() => {
    initialize({ theme: 'light' });
  }, []);

  return <WebOsAppBar theme="light" />;
}
```

### Vanilla JavaScript

```javascript
import { initialize } from '@web-os/core';

async function initApp() {
  const webOsCore = await initialize({ theme: 'light' });
  
  // Create an app bar
  webOsCore.createAppBar('#app', { theme: 'light' });
  
  // Create a window
  const window = webOsCore.createWindow({ 
    title: 'My Window', 
    width: 400, 
    height: 300 
  });
}
```

### Browser (UMD)

```html
<script src="https://unpkg.com/@web-os/core/umd"></script>
<script>
  WebOsCore.initialize({ theme: 'light' }).then(core => {
    core.createAppBar('#app', { theme: 'light' });
  });
</script>
```

## API

### Universal API

- `initialize(options)` - Initialize the WebOS SDK (works in all environments)
- `createAppBar(container, options)` - Create an app bar (vanilla JS only)
- `createWindow(options)` - Create a draggable window (vanilla JS only)

### React Components

- `WebOsAppBar` - A Material-UI based app bar component

## Build Outputs

- `dist/index.esm.js` - ESM build (works everywhere)
- `dist/index.cjs.js` - CommonJS build (Node.js)
- `dist/core.umd.js` - UMD build (browsers)
- `dist/index.d.ts` - TypeScript definitions
