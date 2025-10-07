// Re-export React components
export * from "./components";

// Import React for rendering
import React from 'react';
import { createRoot } from 'react-dom/client';
import { WebOsAppBar } from './components/WebOsAppBar';

// Shared types
export interface WebOsOptions {
  mount?: string; // e.g. CSS selector
  theme?: "light" | "dark";
}

export interface WebOsCore {
  destroy: () => void;
  version: string;
  createAppBar?: (container: string | HTMLElement, options?: { theme?: "light" | "dark" }) => void;
  createWindow?: (options?: { title?: string; width?: number; height?: number }) => HTMLElement;
}

// Keep track of the single instance
let instance: WebOsCore | null = null;

// Universal initialize function that works in both React and vanilla environments
export async function initialize(options: WebOsOptions): Promise<WebOsCore> {
  return new Promise((resolve, reject) => {
    try {
      // If an instance already exists, return it
      if (instance) {
        console.warn(
          "WebOS SDK is already initialized. Returning existing instance.",
        );
        resolve(instance);
        return;
      }

      // In a non-browser environment, return a mock instance
      if (typeof document === "undefined") {
        console.warn(
          "WebOS SDK initialization skipped: Not in browser environment",
        );
        const mockCore: WebOsCore = {
          destroy: () => {},
          version: "0.0.1",
          createAppBar: () => {},
          createWindow: () => document.createElement('div'),
        };
        instance = mockCore;
        resolve(mockCore);
        return;
      }

      const core: WebOsCore = {
        destroy: () => {
          instance = null;
          if (typeof window !== "undefined") {
            delete (window as any).webOsCore;
          }
        },
        version: "0.0.1",
        // Vanilla JavaScript methods (only available in browser)
        createAppBar: (container: string | HTMLElement, options: { theme?: "light" | "dark" } = {}) => {
          const targetElement = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
          
          if (!targetElement) {
            console.error('Container element not found');
            return;
          }

          // Create a container div for the React component
          const appBarContainer = document.createElement('div');
          targetElement.appendChild(appBarContainer);

          // Render the React component
          const root = createRoot(appBarContainer);
          root.render(React.createElement(WebOsAppBar, { theme: options.theme }));
        },
        createWindow: (options: { title?: string; width?: number; height?: number } = {}) => {
          const window = document.createElement('div');
          window.style.cssText = `
            position: fixed;
            top: 80px;
            left: 20px;
            width: ${options.width || 400}px;
            height: ${options.height || 300}px;
            background: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 100;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
          `;

          const titleBar = document.createElement('div');
          titleBar.style.cssText = `
            background: #f5f5f5;
            padding: 8px 16px;
            border-bottom: 1px solid #ddd;
            border-radius: 8px 8px 0 0;
            font-weight: 500;
            font-size: 0.875rem;
            color: #333;
          `;
          titleBar.textContent = options.title || 'Window';

          const content = document.createElement('div');
          content.style.cssText = `
            flex: 1;
            padding: 16px;
            overflow: auto;
          `;
          content.textContent = 'Window content goes here';

          window.appendChild(titleBar);
          window.appendChild(content);

          document.body.appendChild(window);
          return window;
        }
      };

      // Store the instance
      instance = core;

      // Attach to window for global usage
      if (typeof window !== "undefined") {
        (window as any).webOsCore = core;
      }

      // Log successful initialization
      console.info("WebOS SDK initialized successfully");

      resolve(core);
    } catch (err) {
      console.error("Failed to initialize WebOS SDK:", err);
      reject(err);
    }
  });
}
