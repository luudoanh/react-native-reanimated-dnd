import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

export default function ExpoQRSection(): ReactNode {
  return (
    <section className={styles.expoSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Try it yourself</h2>
          <p className={styles.sectionSubtitle}>
            Experience the library in action with our interactive example app
          </p>
        </div>
        <div className="row">
          <div className="col col--6">
            <div className={styles.expoContent}>
              <div className={styles.featureList}>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 12l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>Interactive drag & drop demos</span>
                </div>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 12l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>Sortable lists with drag handles support</span>
                </div>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 12l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>Custom animations and gestures</span>
                </div>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M8 12l2 2 4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span>
                    Feature-packed with collision detection, bounded dragging,
                    and more
                  </span>
                </div>
              </div>
              <div className={styles.expoButtons}>
                <Link
                  className={clsx("button", styles.primaryButton)}
                  to="https://github.com/entropyconquers/react-native-reanimated-dnd/tree/main/example-app"
                >
                  View Example App
                </Link>
                <Link
                  className={clsx("button", styles.secondaryButton)}
                  to="https://github.com/entropyconquers/react-native-reanimated-dnd"
                >
                  GitHub Repository
                </Link>
              </div>
            </div>
          </div>
          <div className="col col--6">
            <div className={styles.qrContainer}>
              <div className={styles.qrCard}>
                <img
                  src="/img/example-app.svg"
                  alt="QR Code for Example App"
                  className={styles.qrImage}
                />
              </div>
              <div className={styles.instructions}>
                <h4 className={styles.instructionsTitle}>How to use</h4>
                <ol className={styles.instructionsList}>
                  <li>
                    Install <Link to="https://expo.dev/client">Expo Go</Link> on
                    your phone
                  </li>
                  <li>Scan the QR code with your camera</li>
                  <li>Open the link in Expo Go</li>
                  <li>Start exploring the examples</li>
                </ol>
                <p className={styles.note}>
                  Scan the QR code above to try the interactive examples on your
                  device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
