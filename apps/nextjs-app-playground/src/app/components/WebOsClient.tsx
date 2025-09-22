"use client";
import { useEffect, useState } from "react";
import { initialize, WebOsAppBar } from "@web-os/core";

export function WebOsClient() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Initialize your webOS application here
    initialize({ theme })
      .then(() => {
        console.info("WebOS application initialized");
      })
      .catch((error) => {
        console.error("Failed to initialize WebOS application:", error);
      });

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [theme]);

  return <WebOsAppBar theme={theme} />;
}
