"use client";
import { useEffect, useState } from "react";
import { initialize, type WebOs } from "@web-os/core";

export function WebOsClient() {
  const [theme] = useState<"light" | "dark">("light");

  useEffect(() => {
    let webOs: WebOs | null = null;
    // Initialize your webOS application here
    initialize({ theme })
      .then((sdk) => {
        webOs = sdk;
        // Do something with the WebOS SDK
      })
      .catch((error) => {
        console.error('Failed to initialize WebOS SDK:', error);
      });

    // Cleanup function
    return () => {
      if (webOs) {
        webOs.destroy();
      }
    };
  }, [theme]);

  return null;
}
