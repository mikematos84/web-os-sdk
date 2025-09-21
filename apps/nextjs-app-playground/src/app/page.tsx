import { Suspense } from "react";
import styles from "./page.module.css";
import WebOsClient from "../components/WebOsClient";
import MainContent from "../components/MainContent";

export default function Home() {
  return (
    <div className={styles.page}>
      <WebOsClient />
      <Suspense fallback={<div>Loading application...</div>}>
        <MainContent />
      </Suspense>
    </div>
  );
}
