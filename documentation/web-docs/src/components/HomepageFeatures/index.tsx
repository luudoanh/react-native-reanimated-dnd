import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  icon: ReactNode;
  description: ReactNode;
  metric?: string;
  metricLabel?: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Smooth Performance",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    metric: "60fps",
    metricLabel: "animations",
    description: (
      <>
        Built with Reanimated 3 for buttery-smooth animations that run on the UI
        thread. No more laggy interactions.
      </>
    ),
  },
  {
    title: "Simple API",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L2 7l10 5 10-5-10-5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 17l10 5 10-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12l10 5 10-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    metric: "2min",
    metricLabel: "setup",
    description: (
      <>
        Get started instantly with our intuitive API. Wrap components with{" "}
        <code>Draggable</code> and <code>Droppable</code> — that's it.
      </>
    ),
  },
  {
    title: "Cross-Platform",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y="3"
          width="20"
          height="14"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="8"
          y1="21"
          x2="16"
          y2="21"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="12"
          y1="17"
          x2="12"
          y2="21"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    ),
    metric: "100%",
    metricLabel: "compatible",
    description: (
      <>
        Works perfectly on iOS and Android with consistent behavior. One
        codebase, seamless experience.
      </>
    ),
  },
];

function Feature({
  title,
  icon,
  description,
  metric,
  metricLabel,
}: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className={styles.featureCard}>
        <div className={styles.featureHeader}>
          <div className={styles.featureIcon}>{icon}</div>
          {metric && (
            <div className={styles.featureMetric}>
              <div className={styles.metricNumber}>{metric}</div>
              <div className={styles.metricLabel}>{metricLabel}</div>
            </div>
          )}
        </div>
        <div className={styles.featureContent}>
          <Heading as="h3" className={styles.featureTitle}>
            {title}
          </Heading>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featuresHeader}>
          <h2 className={styles.featuresTitle}>
            Why choose React Native Reanimated DnD
          </h2>
          <p className={styles.featuresSubtitle}>
            It's the most performant and developer-friendly drag & drop library
            for React Native, hands down.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
