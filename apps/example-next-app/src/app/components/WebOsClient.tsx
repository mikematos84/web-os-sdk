"use client";
import { useEffect, useState } from "react";
import { initialize } from "@web-os/core";

export function WebOsClient() {
  const [theme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Initialize your webOS application here
    initialize({ theme })
      .then(() => {
        // Do something with the WebOS SDK
      })
      .catch((error) => {
        console.error('Failed to initialize WebOS SDK:', error);
      });

    // Cleanup function
    return () => {
      if ((window as any).webos) {
        (window as any).webos.destroy();
      }
    };
  }, [theme]);

  return null;
}
