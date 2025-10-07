"use client";
import { useEffect, useState } from "react";
import { initialize, WebOsAppBar } from "@web-os/core";

export function WebOsClient() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [webOsCore, setWebOsCore] = useState<any>(null);

  useEffect(() => {
    // Initialize your webOS application here
    initialize({ theme })
      .then((core) => {
        setWebOsCore(core);
      })
      .catch((error) => {
        // Error logging is handled by the core initialize function
      });

    // Cleanup function
    return () => {
      // Any cleanup if needed
    };
  }, [theme]);

  const handleInfoPanelClick = () => {
    if (webOsCore) {
      webOsCore.showInfoPanel({
        title: 'WebOS Information',
        content: 'This is a sample information panel created with the WebOS SDK in Next.js. You can display any content here, including HTML elements and React components.',
        theme: theme
      });
    }
  };

  return <WebOsAppBar theme={theme} onInfoPanelClick={handleInfoPanelClick} />;
}
