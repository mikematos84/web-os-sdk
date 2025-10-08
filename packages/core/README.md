# @web-os/core

The main orchestrator for the WebOS SDK. This package provides the core initialization functionality and serves as the foundation for the entire SDK ecosystem.

## Installation

```bash
pnpm add @web-os/core
```

## Usage

### Basic Initialization

```javascript
import { initialize } from '@web-os/core';

async function initApp() {
  const webOsCore = await initialize({ 
    theme: 'light',
    mount: '#app' // Optional: CSS selector for mounting
  });
  
  console.log('WebOS SDK initialized:', webOsCore.version);
  
  // Clean up when done
  webOsCore.destroy();
}
```

### Browser (UMD)

```html
<script src="https://unpkg.com/@web-os/core/umd"></script>
<script>
  WebOsCore.initialize({ theme: 'light' }).then(core => {
    console.log('WebOS SDK ready:', core.version);
  });
</script>
```

## API

### Core Functions

- `initialize(options)` - Initialize the WebOS SDK (works in all environments)
- `VERSION` - SDK version constant

### WebOsCore Interface

- `destroy()` - Clean up the SDK instance
- `version` - Current SDK version

### Options

- `mount?: string` - CSS selector for mounting (optional)
- `theme?: "light" | "dark"` - Theme preference (optional)

## Build Outputs

- `dist/index.esm.js` - ESM build (works everywhere)
- `dist/index.cjs.js` - CommonJS build (Node.js)
- `dist/core.umd.js` - UMD build (browsers)
- `dist/index.d.ts` - TypeScript definitions
