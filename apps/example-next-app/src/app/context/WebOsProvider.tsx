// app/components/WebOsProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { initialize, type WebOs } from "@web-os/core";

interface WebOsContextType {
  webOs: WebOs | null;
  isReady: boolean;
}

const WebOsContext = createContext<WebOsContextType>({
  webOs: null,
  isReady: false,
});

export function WebOsProvider({ children }: { children: React.ReactNode }) {
  const [webOs, setWebOs] = useState<WebOs | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initialize({ theme: "light" })
      .then((sdk) => {
        setWebOs(sdk);

        // Mount default panels here
        sdk.mountPanel("app-bar");
        
        setIsReady(true);
      })
      .catch(console.error);

    return () => {
      webOs?.destroy();
    };
  }, []);

  return (
    <WebOsContext.Provider value={{ webOs, isReady }}>
      {isReady && children}
    </WebOsContext.Provider>
  );
}

export const useWebOs = () => useContext(WebOsContext);