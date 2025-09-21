"use client";

import Image from "next/image";
import styles from "../app/page.module.css";
import { useWebOs } from "./WebOsClient";

export default function MainContent() {
  const { isReady, isInitializing } = useWebOs();

  // Optional loading state when WebOS is still initializing
  if (isInitializing) {
    return <div className={styles.loading}>Initializing WebOS...</div>;
  }

  return (
    <>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>src/app/page.tsx</code>.
          </li>
          <li>WebOS Status: {isReady ? "Ready" : "Not Ready"}</li>
        </ol>
        {/* Rest of your content from page.tsx */}
      </main>
      {/* You can include the footer here too if it needs client-side features */}
    </>
  );
}
