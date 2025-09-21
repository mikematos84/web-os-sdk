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

      const container = document.querySelector(options.mount || "body");
      if (!container) throw new Error("Mount element not found");

      // Check if root element already exists
      let root = document.getElementById("webos-root");
      if (root) {
        console.warn(
          "WebOS root element already exists. Reusing existing element.",
        );
      } else {
        // Create new root element
        root = document.createElement("div");
        root.id = "webos-root";
        root.innerText = `WebOS Initialized (theme=${options.theme || "light"})`;
        container.appendChild(root);
      }

      const core: WebOsCore = {
        destroy: () => {
          root?.remove();
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
