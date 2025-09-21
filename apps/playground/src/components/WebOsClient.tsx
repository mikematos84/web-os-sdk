"use client";

import { WebOsProvider, useWebOs } from "../context/WebOsContext";
import { useEffect } from "react";

// The inner component that renders based on WebOS state
function WebOsContainer() {
  const { isInitializing, isReady, error } = useWebOs();

  // Add debugging to verify rerender
  useEffect(() => {
    console.log("WebOsContainer rendered with state:", {
      isInitializing,
      isReady,
    });
  }, [isInitializing, isReady]);

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
  // Create the options object
  const options = {
    mount: "#webos-container",
    theme: "light", // Change this to see HMR in action
  };

  // Log options when they change (helps debug HMR)
  useEffect(() => {
    console.log("WebOsClient rendering with options:", options);
  }, [options.theme, options.mount]);

  return (
    <WebOsProvider options={options}>
      <WebOsContainer />
    </WebOsProvider>
  );
}

// Optional: Export the hook for direct usage elsewhere
export { useWebOs };
