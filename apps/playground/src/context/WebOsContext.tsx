"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
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

  // Function to force reinitialization
  const reinitialize = () => {
    if (webOs) {
      webOs.destroy();
      setWebOs(null);
      setIsReady(false);
    }
    setIsInitializing(true);
    setVersion((prev) => prev + 1);
  };

  // Add a useEffect to detect options changes
  useEffect(() => {
    // If options changed while instance exists, reinitialize
    if (webOs) {
      console.log("WebOS options changed, reinitializing");
      reinitialize();
    }
    // We stringify options to detect changes (deep comparison)
  }, [JSON.stringify(options)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Skip if already initialized or not initializing
    if (webOs || !isInitializing) return;

    console.log("Initializing WebOS with options:", options);

    initialize(options)
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
      if (webOs) {
        console.log("Cleaning up WebOS instance");
        webOs.destroy();
        setWebOs(null);
        setIsReady(false);
      }
    };
  }, [options, webOs, isInitializing, version]); // Added version as dependency

  return (
    <WebOsContext.Provider
      value={{ webOs, isInitializing, isReady, error, reinitialize }}
    >
      {children}
    </WebOsContext.Provider>
  );
}
