import { AppBar } from "@mui/material";

// Re-export components
export * from "./components";

export interface WebOsOptions {
  mount?: string; // e.g. CSS selector
  theme?: "light" | "dark";
}

export interface WebOsCore {
  destroy: () => void;
  version: string;
}

// Keep track of the single instance
let instance: WebOsCore | null = null;

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
        };
        instance = mockCore;
        resolve(mockCore);
        return;
      }

      // Since we're now providing a React component to be rendered by the consumer,
      // we don't need to do DOM manipulation here.

      const core: WebOsCore = {
        destroy: () => {
          instance = null;
          if (typeof window !== "undefined") {
            delete (window as any).webOsCore;
          }
        },
        version: "0.0.1",
      };

      // Store the instance
      instance = core;

      // Attach to window for global usage
      if (typeof window !== "undefined") {
        (window as any).webOsCore = core;
      }

      resolve(core);
    } catch (err) {
      reject(err);
    }
  });
}
