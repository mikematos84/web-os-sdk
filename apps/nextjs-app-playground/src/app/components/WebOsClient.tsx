"use client";
import { useEffect, useState } from "react";
import { initialize, WebOsAppBar } from "@web-os/core";

export function WebOsClient() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Initialize your webOS application here
    initialize({ theme })
      .then(() => {
        // Success logging is handled by the core initialize function
      })
      .catch((error) => {
        // Error logging is handled by the core initialize function
      });

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [theme]);

  return <WebOsAppBar theme={theme} />;
}
