import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import ExpoQRSection from "@site/src/components/ExpoQRSection";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroLabel}>React Native Reanimated DnD</div>
          <Heading as="h1" className={styles.heroTitle}>
            The drag and drop library that finally works on React Native.
          </Heading>
          <p className={styles.heroDescription}>
            Built with Reanimated 3 for buttery-smooth 60fps animations. Simple
            API, powerful features, works everywhere.
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={clsx("button", styles.primaryButton)}
              to="/docs/intro"
            >
              Get Started
            </Link>
            <Link
              className={clsx("button", styles.secondaryButton)}
              to="https://www.npmjs.com/package/react-native-reanimated-dnd"
            >
              View on NPM
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.statValue}>60fps</div>
              <div className={styles.statLabel}>Smooth animations</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.statValue}>2min</div>
              <div className={styles.statLabel}>Setup time</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>Cross-platform</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Drag & Drop for React Native`}
      description="A powerful drag-and-drop library for React Native using Reanimated 3. Smooth animations, simple API, and works perfectly on iOS and Android."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <ExpoQRSection />
      </main>
    </Layout>
  );
}
