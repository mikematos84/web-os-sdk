import { SDK_NAME } from "./constants";
import { logger, type Logger } from "./libs/logger";

// Export version
export { SDK_NAME, VERSION } from "./constants";

// Shared types
export interface WebOsOptions {
  theme?: "light" | "dark";
}

export interface WebOs {
  destroy: () => void;
  name: string;
  version: string;
  logger: Logger;
}


// Base SDK instance
export const baseSdk: WebOs = {
  destroy: () => {},
  logger: logger,
  version: "0.0.1",
  name: SDK_NAME,
};

// Keep track of the single instance
let instance: WebOs | null = null;

// Universal initialize function that works in both React and vanilla environments
export async function initialize(options: WebOsOptions): Promise<WebOs> {
  return new Promise((resolve, reject) => {
    try {
      // If an instance already exists, return it
      if (instance) {
        logger.warn(
          "WebOS SDK is already initialized. Returning existing instance.",
        );
        resolve(instance);
        return;
      }

      // In a non-browser environment, return a mock instance
      if (typeof document === "undefined") {
        logger.warn(
          "WebOS SDK initialization skipped: Not in browser environment",
        );
        const mockSdk: WebOs = baseSdk;
        instance = mockSdk;
        resolve(mockSdk);
        return;
      }

      const sdk: WebOs =  {
        ...baseSdk,
        destroy: () => {
          instance = null;
          if (typeof window !== "undefined") {
            delete (window as any).webos;
          }
        },
      };

      instance = sdk;

      // Attach to window for global usage
      if (typeof window !== "undefined") {
        (window as any).webos = instance;
      }

      // Log successful initialization
      logger.info("initialized successfully");

      resolve(instance);
    } catch (err) {
      logger.error("Failed to initialize", err);
      reject(err);
    }
  });
}
