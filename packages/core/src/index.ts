// Re-export React components
export * from "./components";

// Export version
export { VERSION } from "./constants";

// Import React for rendering
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppBarContainer } from './components/AppBarContainer';
import { InfoPanel } from './components/InfoPanel';

// Shared types
export interface WebOsOptions {
  mount?: string; // e.g. CSS selector
  theme?: "light" | "dark";
}

export interface WebOsCore {
  destroy: () => void;
  version: string;
  createAppBar?: (container: string | HTMLElement, options?: { theme?: "light" | "dark" }) => void;
  showInfoPanel?: (options?: { title?: string; content?: string | React.ReactNode; theme?: "light" | "dark" }) => void;
  hideInfoPanel?: () => void;
}

// Keep track of the single instance
let instance: WebOsCore | null = null;

// Keep track of info panel state
let infoPanelRoot: any = null;
let infoPanelContainer: HTMLElement | null = null;

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
          showInfoPanel: () => {},
          hideInfoPanel: () => {},
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
          root.render(React.createElement(AppBarContainer, { theme: options.theme }));
        },
        showInfoPanel: (options: { title?: string; content?: string | React.ReactNode; theme?: "light" | "dark" } = {}) => {
          // Hide existing panel if open
          if (infoPanelRoot) {
            infoPanelRoot.unmount();
            infoPanelRoot = null;
          }
          if (infoPanelContainer) {
            infoPanelContainer.remove();
            infoPanelContainer = null;
          }

          // Create container for info panel
          infoPanelContainer = document.createElement('div');
          infoPanelContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            pointer-events: none;
          `;
          document.body.appendChild(infoPanelContainer);

          // Create React root and render info panel
          infoPanelRoot = createRoot(infoPanelContainer);
          infoPanelRoot.render(
            React.createElement(InfoPanel, {
              open: true,
              onClose: () => {
                if (infoPanelRoot) {
                  infoPanelRoot.unmount();
                  infoPanelRoot = null;
                }
                if (infoPanelContainer) {
                  infoPanelContainer.remove();
                  infoPanelContainer = null;
                }
              },
              title: options.title,
              content: options.content,
              theme: options.theme,
            })
          );
        },
        hideInfoPanel: () => {
          if (infoPanelRoot) {
            infoPanelRoot.unmount();
            infoPanelRoot = null;
          }
          if (infoPanelContainer) {
            infoPanelContainer.remove();
            infoPanelContainer = null;
          }
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
