"use client";

import { WebOsProvider, useWebOs } from "../context/WebOsContext";
import { useEffect, useMemo } from "react";

// The inner component that renders based on WebOS state
function WebOsContainer() {
  const { isInitializing, isReady, error } = useWebOs();

  // Add debugging to verify rerender (with error handling)
  useEffect(() => {
    try {
      console.log("WebOsContainer rendered with state:", {
        isInitializing,
        isReady,
        error: error ? error.message : null,
      });
    } catch (e) {
      console.warn("Error logging WebOS state:", e);
    }
  }, [isInitializing, isReady, error]);

  if (error) {
    return (
      <div id="webos-container" className="webos-error">
        Failed to initialize WebOS: {error.message}
      </div>
    );
  }

  return (
    <div
      id="webos-container"
      className={isInitializing ? "webos-loading" : ""}
    />
  );
}

// The main component that provides the WebOS context
export default function WebOsClient() {
  // Create the options object with useMemo to prevent unnecessary rerenders
  const options = useMemo(
    () => ({
      mount: "#webos-container",
      theme: "light", // Change this to see HMR in action
    }),
    // Empty dependency array ensures this object is stable across renders
    [],
  );

  // Only log options on mount, not on every render
  useEffect(() => {
    console.log("WebOsClient mounted with options:", options);
    // This will run only once when the component mounts
  }, []);

  // Remove the 'key' prop to prevent remounting on every render
  return (
    <WebOsProvider options={options}>
      <WebOsContainer />
    </WebOsProvider>
  );
}

// Optional: Export the hook for direct usage elsewhere
export { useWebOs };
