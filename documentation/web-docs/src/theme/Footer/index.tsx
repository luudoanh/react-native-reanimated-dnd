import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerBackground}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gradientOrb3}></div>
      </div>
      
      <div className="container">
        <div className={styles.footerContent}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <div className={styles.brandLogo}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.brandText}>
                <h3 className={styles.brandTitle}>React Native Reanimated DnD</h3>
                <p className={styles.brandSubtitle}>
                  The drag and drop library that finally works on React Native
                </p>
              </div>
            </div>
            
            <div className={styles.footerLinks}>
              <div className={styles.linkColumn}>
                <h4 className={styles.linkTitle}>Documentation</h4>
                <ul className={styles.linkList}>
                  <li>
                    <Link to="/docs/intro" className={styles.footerLink}>
                      Getting Started
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/api/overview" className={styles.footerLink}>
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/examples/basic-drag-drop" className={styles.footerLink}>
                      Examples
                    </Link>
                  </li>
                  <li>
                    <Link to="/docs/guides/performance" className={styles.footerLink}>
                      Guides
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className={styles.linkColumn}>
                <h4 className={styles.linkTitle}>Community</h4>
                <ul className={styles.linkList}>
                  <li>
                    <Link 
                      to="https://github.com/entropyconquers/react-native-reanimated-dnd/issues" 
                      className={styles.footerLink}
                    >
                      GitHub Issues
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="https://github.com/entropyconquers/react-native-reanimated-dnd/discussions" 
                      className={styles.footerLink}
                    >
                      Discussions
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="https://github.com/entropyconquers/react-native-reanimated-dnd" 
                      className={styles.footerLink}
                    >
                      Contribute
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className={styles.linkColumn}>
                <h4 className={styles.linkTitle}>Resources</h4>
                <ul className={styles.linkList}>
                  <li>
                    <Link 
                      to="https://github.com/entropyconquers/react-native-reanimated-dnd" 
                      className={styles.footerLink}
                    >
                      GitHub Repository
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="https://github.com/entropyconquers/react-native-reanimated-dnd/tree/main/example-app" 
                      className={styles.footerLink}
                    >
                      Example App
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="https://github.com/entropyconquers/react-native-reanimated-dnd/releases" 
                      className={styles.footerLink}
                    >
                      Releases
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className={styles.footerBottom}>
            <div className={styles.footerCopyright}>
              <p>© {new Date().getFullYear()} React Native Reanimated DnD. Built with ❤️ by <a href="https://github.com/entropyconquers" target="_blank" rel="noopener noreferrer">entropyconquers</a>, for developers.</p>
            </div>
            
            <div className={styles.footerSocial}>
              <Link 
                to="https://github.com/entropyconquers/react-native-reanimated-dnd" 
                className={styles.socialLink}
                aria-label="GitHub"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 