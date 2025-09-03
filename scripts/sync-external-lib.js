import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const destDir = path.resolve(__dirname, "../example-app/external-lib");

// Directories to sync from root to external-lib
const dirsToSync = ["components", "context", "hooks", "types"];
const filesToSync = ["index.ts"];

console.log("🔄 Starting external-lib sync watcher...");
console.log(`📁 Root directory: ${rootDir}`);
console.log(`📁 Destination: ${destDir}`);

// Function to copy a single directory or file
const copyPath = async (srcPath, destPath) => {
  try {
    const stat = await fs.promises.stat(srcPath);
    if (stat.isDirectory()) {
      await fs.promises.cp(srcPath, destPath, { recursive: true, force: true });
    } else {
      // Ensure destination directory exists
      const destDirPath = path.dirname(destPath);
      await fs.promises.mkdir(destDirPath, { recursive: true });
      await fs.promises.copyFile(srcPath, destPath);
    }
    console.log(
      `✅ Copied: ${path.relative(rootDir, srcPath)} -> ${path.relative(rootDir, destPath)}`
    );
  } catch (error) {
    console.error(`❌ Error copying ${srcPath}: ${error.message}`);
  }
};

// Function to perform initial sync
const initialSync = async () => {
  console.log("🔄 Performing initial sync...");

  // Ensure destination directory exists
  await fs.promises.mkdir(destDir, { recursive: true });

  // Copy directories
  for (const dir of dirsToSync) {
    const srcPath = path.join(rootDir, dir);
    const destPath = path.join(destDir, dir);
    await copyPath(srcPath, destPath);
  }

  // Copy files
  for (const file of filesToSync) {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(destDir, file);
    await copyPath(srcPath, destPath);
  }

  console.log("✅ Initial sync completed");
};

// Function to sync all paths
const syncAll = async () => {
  console.log("🔄 Syncing all paths...");

  // Copy directories
  for (const dir of dirsToSync) {
    const srcPath = path.join(rootDir, dir);
    const destPath = path.join(destDir, dir);
    if (fs.existsSync(srcPath)) {
      await copyPath(srcPath, destPath);
    }
  }

  // Copy files
  for (const file of filesToSync) {
    const srcPath = path.join(rootDir, file);
    const destPath = path.join(destDir, file);
    if (fs.existsSync(srcPath)) {
      await copyPath(srcPath, destPath);
    }
  }
};

// Debounce function to prevent multiple rapid syncs
let syncTimeout;
const debouncedSync = () => {
  clearTimeout(syncTimeout);
  syncTimeout = setTimeout(syncAll, 100); // Wait 100ms before syncing
};

// Set up watchers for each directory and file
const setupWatchers = () => {
  const watchers = [];

  // Watch directories
  for (const dir of dirsToSync) {
    const dirPath = path.join(rootDir, dir);
    if (fs.existsSync(dirPath)) {
      const watcher = fs.watch(
        dirPath,
        { recursive: true },
        (eventType, filename) => {
          if (filename) {
            console.log(`📝 ${eventType}: ${dir}/${filename}`);
            debouncedSync();
          }
        }
      );
      watchers.push(watcher);
      console.log(`👀 Watching: ${dir}/`);
    }
  }

  // Watch files
  for (const file of filesToSync) {
    const filePath = path.join(rootDir, file);
    if (fs.existsSync(filePath)) {
      const watcher = fs.watch(filePath, (eventType, filename) => {
        console.log(`📝 ${eventType}: ${file}`);
        debouncedSync();
      });
      watchers.push(watcher);
      console.log(`👀 Watching: ${file}`);
    }
  }

  return watchers;
};

// Handle graceful shutdown
const cleanup = (watchers) => {
  console.log("\n🛑 Shutting down watchers...");
  watchers.forEach((watcher) => watcher.close());
  process.exit(0);
};

// Main execution
const main = async () => {
  try {
    // Perform initial sync
    await initialSync();

    // Set up file watchers
    const watchers = setupWatchers();

    console.log("\n✅ Sync watcher is running! Press Ctrl+C to stop.");

    // Handle process termination
    process.on("SIGINT", () => cleanup(watchers));
    process.on("SIGTERM", () => cleanup(watchers));
  } catch (error) {
    console.error("❌ Error starting sync watcher:", error.message);
    process.exit(1);
  }
};

main();
