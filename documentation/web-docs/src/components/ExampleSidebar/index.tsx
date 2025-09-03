import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";

type PreviewMode = "qr" | "web";

const STORAGE_KEY = "rn-dnd-preview-mode";

export default function ExampleSidebar(): JSX.Element {
  const [previewMode, setPreviewMode] = useState<PreviewMode>("qr");
  const [showInstructions, setShowInstructions] = useState(true);

  // Load user preference from localStorage
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY) as PreviewMode;
      if (savedMode === "qr" || savedMode === "web") {
        setPreviewMode(savedMode);
        setShowInstructions(savedMode === "qr");
      }
    } catch (error) {
      console.warn("Failed to load preview mode preference:", error);
    }
  }, []);

  // Save user preference to localStorage
  const handleModeChange = (mode: PreviewMode) => {
    setPreviewMode(mode);
    setShowInstructions(mode === "qr");
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      console.warn("Failed to save preview mode preference:", error);
    }
  };

  const handlePreviewInApp = () => {
    setShowInstructions(false);
  };

  useEffect(() => {
    const addStyle = () => {
      const head = document.head;
      const style = document.createElement("style");
      style.textContent = ".docItemCol_VOVn { max-width: 60%!important; }";
      head.appendChild(style);
    };
    const removeWidthStyle = () => {
      const head = document.head;
      const style = document.querySelector("style");
      if (style) {
        head.removeChild(style);
      }
    };
    addStyle();
    return () => removeWidthStyle();
  }, []);

  return (
    <div className={styles.exampleSidebar}>
      {/* Header with toggle */}
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>Live Example</h3>

        <div className={styles.modeToggle}>
          <button
            className={`${styles.toggleButton} ${previewMode === "qr" ? styles.active : ""}`}
            onClick={() => handleModeChange("qr")}
            aria-label="Show QR code for mobile preview"
          >
            <svg
              className={styles.toggleIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM19 15h2v2h-2zM17 13h2v2h-2z" />
            </svg>
            QR
          </button>
          <button
            className={`${styles.toggleButton} ${previewMode === "web" ? styles.active : ""}`}
            onClick={() => handleModeChange("web")}
            aria-label="Show web preview"
          >
            <svg
              className={styles.toggleIcon}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Web
          </button>
        </div>
      </div>

      {/* Content based on mode */}
      {previewMode === "qr" ? (
        <div className={styles.qrContent}>
          {showInstructions ? (
            <div className={styles.instructionsContainer}>
              <div className={styles.qrCodeContainer}>
                <img
                  src="/img/example-app.svg"
                  alt="QR Code for React Native DnD Examples"
                  className={styles.qrCode}
                />
              </div>

              <div className={styles.instructions}>
                <h4 className={styles.instructionsTitle}>
                  Preview on Your Device
                </h4>
                <p className={styles.instructionsSubtitle}>
                  Get the best experience by testing on your mobile device
                </p>

                <div className={styles.stepsList}>
                  <div className={styles.step}>
                    <div className={styles.stepNumber}>1</div>
                    <div className={styles.stepContent}>
                      <strong>Install Expo Go</strong>
                      <p>Download from App Store or Google Play</p>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNumber}>2</div>
                    <div className={styles.stepContent}>
                      <strong>Scan QR Code</strong>
                      <div className={styles.platformInstructions}>
                        <div className={styles.platform}>
                          <span className={styles.platformIcon}>📱</span>
                          <div>
                            <strong>iOS:</strong>
                            <span> Open Camera app and point at QR code</span>
                          </div>
                        </div>
                        <div className={styles.platform}>
                          <span className={styles.platformIcon}>🤖</span>
                          <div>
                            <strong>Android:</strong>
                            <span>
                              {" "}
                              Open Expo Go app and tap "Scan QR Code"
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.step}>
                    <div className={styles.stepNumber}>3</div>
                    <div className={styles.stepContent}>
                      <strong>Explore Examples</strong>
                      <p>Try drag-and-drop interactions with touch gestures</p>
                    </div>
                  </div>
                </div>

                <button
                  className={styles.previewButton}
                  onClick={handlePreviewInApp}
                >
                  <svg
                    className={styles.buttonIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span className={styles.buttonText}>Preview in App</span>
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.qrOnlyContainer}>
              <div className={styles.qrCodeContainer}>
                <img
                  src="/img/example-app.svg"
                  alt="QR Code for React Native DnD Examples"
                  className={styles.qrCode}
                />
              </div>
              <p className={styles.qrDescription}>
                Scan with your mobile device to try the examples
              </p>
              <button
                className={styles.showInstructionsButton}
                onClick={() => setShowInstructions(true)}
              >
                Show Instructions
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.webContent}>
          <div className={styles.iframeContainer}>
            <iframe
              src="https://tranquil-flan-fb5660.netlify.app/"
              className={styles.iframe}
              allowFullScreen
              title="React Native Reanimated DnD Examples"
            />
          </div>
          <p className={styles.webDescription}>
            Interactive web preview - best experienced on mobile device
          </p>
        </div>
      )}
    </div>
  );
}
