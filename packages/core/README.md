# @web-os/core

A universal WebOS SDK that works in both React and vanilla JavaScript environments with a single import.

## Installation

```bash
pnpm add @web-os/core
```

## Usage

### React/Next.js

```tsx
import { initialize, AppBarContainer } from '@web-os/core';

function App() {
  useEffect(() => {
    initialize({ theme: 'light' });
  }, []);

  return <AppBarContainer theme="light" />;
}
```

### Vanilla JavaScript

```javascript
import { initialize } from '@web-os/core';

async function initApp() {
  const webOsCore = await initialize({ theme: 'light' });
  
  // Create an app bar (includes integrated info panel button)
  webOsCore.createAppBar('#app', { theme: 'light' });
  
  // Show information panel
  webOsCore.showInfoPanel({
    title: 'Information',
    content: 'This is an information panel.',
    theme: 'light'
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
- `createAppBar(container, options)` - Create an app bar with integrated info panel button (vanilla JS only)
- `showInfoPanel(options)` - Show information panel (vanilla JS only)
- `hideInfoPanel()` - Hide information panel (vanilla JS only)

### React Components

- `AppBarContainer` - A Material-UI based app bar component with integrated info panel button
- `InfoPanel` - A Material-UI based information panel component

## Build Outputs

- `dist/index.esm.js` - ESM build (works everywhere)
- `dist/index.cjs.js` - CommonJS build (Node.js)
- `dist/core.umd.js` - UMD build (browsers)
- `dist/index.d.ts` - TypeScript definitions
