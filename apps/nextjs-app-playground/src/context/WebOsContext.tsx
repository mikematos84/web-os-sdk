"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { initialize, WebOsCore, WebOsOptions } from "@web-os/core";

// Define the context interface
interface WebOsContextType {
  webOs: WebOsCore | null;
  isInitializing: boolean;
  isReady: boolean;
  error: Error | null;
  reinitialize: () => void; // Added function to force reinitialization
}

// Extend WebOsOptions to include internal tracking property
interface ExtendedWebOsOptions extends WebOsOptions {
  _optionsStr?: string; // Internal property for tracking changes
}

// Create the context with default values
const WebOsContext = createContext<WebOsContextType>({
  webOs: null,
  isInitializing: false,
  isReady: false,
  error: null,
  reinitialize: () => {},
});

// Custom hook for using the WebOS context
export const useWebOs = () => useContext(WebOsContext);

// Props for the provider component
interface WebOsProviderProps {
  children: ReactNode;
  options: WebOsOptions;
}

// Provider component that initializes the WebOS SDK
export function WebOsProvider({ children, options }: WebOsProviderProps) {
  const [webOs, setWebOs] = useState<WebOsCore | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [version, setVersion] = useState(0); // Used to force reinitialization
  const [isMounted, setIsMounted] = useState(false);
  const optionsRef = useRef<ExtendedWebOsOptions>(options);
  const unmountingRef = useRef(false);

  // Function to safely force reinitialization
  const reinitialize = useCallback(() => {
    if (webOs && !unmountingRef.current) {
      unmountingRef.current = true;

      // Use setTimeout to defer destruction until after current render cycle
      setTimeout(() => {
        try {
          // Check if webOs still exists before destroying
          if (webOs) {
            webOs.destroy();
          }

          // Check if component is still mounted before updating state
          if (isMounted) {
            setWebOs(null);
            setIsReady(false);
            setIsInitializing(true);
            setVersion((prev) => prev + 1);
          }
        } catch (err) {
          console.error("Error during WebOS reinitialization:", err);
        } finally {
          unmountingRef.current = false;
        }
      }, 0);
    } else if (!webOs) {
      setIsInitializing(true);
      setVersion((prev) => prev + 1);
    }
  }, [webOs]);

  // Add a useEffect to detect options changes
  // Handle mounting state for hydration
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Store the latest options in a ref to avoid unnecessary re-renders
  useEffect(() => {
    // Store both the options object and its stringified version
    optionsRef.current = options;
    if (!optionsRef.current._optionsStr) {
      optionsRef.current._optionsStr = JSON.stringify(options);
    }
  }, [options]);

  // Handle options changes with deep comparison
  useEffect(() => {
    // Skip during server-side rendering or if not mounted
    if (typeof window === "undefined" || !isMounted) return;

    // Store current options string for comparison
    const currentOptionsStr = JSON.stringify(options);

    // If options changed while instance exists, reinitialize
    if (webOs && !unmountingRef.current) {
      // Compare with previous options
      if (currentOptionsStr !== optionsRef.current._optionsStr) {
        console.log("WebOS options changed, reinitializing");
        // Schedule reinitialization for next tick to avoid render-phase updates
        const timeoutId = setTimeout(() => {
          reinitialize();
        }, 0);
        return () => clearTimeout(timeoutId);
      }
    }

    // Store the stringified version for future comparisons
    optionsRef.current._optionsStr = currentOptionsStr;
  }, [options, isMounted, webOs, reinitialize]); // Use options object reference, not stringified version

  useEffect(() => {
    // Skip if already initialized, not initializing, or during SSR/hydration
    if (webOs || !isInitializing || typeof window === "undefined" || !isMounted)
      return;

    console.log("Initializing WebOS with options:", optionsRef.current);

    initialize(optionsRef.current)
      .then((core) => {
        setWebOs(core);
        setIsReady(true);
        setError(null);
        console.log("WebOS initialized successfully", core);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        console.error("WebOS initialization failed", err);
      })
      .finally(() => {
        setIsInitializing(false);
      });

    // Cleanup function
    return () => {
      if (webOs && !unmountingRef.current) {
        console.log("Cleaning up WebOS instance");
        unmountingRef.current = true;

        // Use setTimeout to defer destruction until after current render cycle
        setTimeout(() => {
          try {
            // Only destroy if webOs still exists
            if (webOs) {
              webOs.destroy();
            }

            // Only update state if component is still mounted
            if (isMounted) {
              setWebOs(null);
              setIsReady(false);
            }
          } catch (err) {
            console.error("Error during WebOS cleanup:", err);
          } finally {
            unmountingRef.current = false;
          }
        }, 0);
      }
    };
  }, [webOs, isInitializing, version, isMounted]); // Removed options dependency, added isMounted

  // Add an effect to update components when they change
  useEffect(() => {
    if (
      webOs &&
      isReady &&
      isMounted &&
      !unmountingRef.current &&
      optionsRef.current.components
    ) {
      // Schedule update for next tick to avoid conflicts with render
      const timeoutId = setTimeout(() => {
        if (webOs && !unmountingRef.current) {
          try {
            webOs.update(optionsRef.current.components);
          } catch (err) {
            console.error("Error updating WebOS components:", err);
          }
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [webOs, isReady, isMounted, options.components]);

  // Only render children when mounted (client-side)
  // This prevents hydration mismatches
  return (
    <WebOsContext.Provider
      value={{ webOs, isInitializing, isReady, error, reinitialize }}
    >
      {isMounted ? children : null}
    </WebOsContext.Provider>
  );
}
