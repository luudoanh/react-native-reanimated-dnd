# Development Guide

This guide covers development-specific tasks and tools for maintainers of react-native-reanimated-dnd.

## 🔄 Syncing External Library

The example app uses a local copy of the library code located in `example-app/external-lib/` to ensure it always tests the latest changes without needing to republish the package.

### Automatic Sync Watcher

To keep the external library in sync with the main library code, use the sync watcher:

```bash
npm run sync:external-lib
```

This will:

- ✅ Perform an initial sync of all library files
- 👀 Watch for changes in the main library directories (`components/`, `context/`, `hooks/`, `types/`)
- 🔄 Automatically copy changes to `example-app/external-lib/`
- 📝 Show detailed logs of what files are being synced

### What Gets Synced

The following directories and files are automatically synchronized:

- `components/` → `example-app/external-lib/components/`
- `context/` → `example-app/external-lib/context/`
- `hooks/` → `example-app/external-lib/hooks/`
- `types/` → `example-app/external-lib/types/`
- `index.ts` → `example-app/external-lib/index.ts`

### Development Workflow

1. Start the sync watcher in one terminal:

   ```bash
   npm run sync:external-lib
   ```

2. In another terminal, start the example app:

   ```bash
   cd example-app
   npm start
   ```

3. Make changes to the library code in the root directory
4. The sync watcher automatically copies changes to `external-lib/`
5. The example app will hot reload with your changes

### Manual Sync

If you prefer to sync manually, you can run the script once and it will exit after the initial sync:

```bash
node scripts/sync-external-lib.js
```

Then interrupt it with `Ctrl+C` after the initial sync completes.

## 🛠️ Other Development Commands

- `npm run build` - Build the library for production
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 📝 Notes

- The sync watcher uses filesystem watching, so changes are detected in real-time
- Debouncing prevents excessive copying during rapid file changes
- The watcher handles graceful shutdown when you stop it with `Ctrl+C`
