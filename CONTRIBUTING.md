# Contributing to React Native Reanimated DnD

🎉 Thank you for your interest in contributing! This project is open to community contributions and we welcome your ideas, bug fixes, improvements, and feedback.

---

## 📦 Project Setup

To contribute to the library or its example app, follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/entropyconquers/react-native-reanimated-dnd.git
cd react-native-reanimated-dnd
```

### 2. Install dependencies

```bash
npm install
cd example-app
npm install
```

### 3. Run the example app

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

Ensure everything is working before making any changes.

---

## 🧠 Contributing Guidelines

### 📁 Make Changes in the Right Place

- Core library code lives in the root `/` directory.
- The `/example-app` directory contains the showcase app.
- Update or add examples to demonstrate new features or fixes.

### 🧹 Code Standards

- Use **TypeScript** and follow existing typing patterns.
- Maintain **clean, readable code**.
- Use **descriptive variable names** and meaningful commit messages.
- Run **Prettier** before committing.

```bash
npm run format # Format all files with prettier
```

---

## 🧪 Testing Your Changes

We do not currently have automated tests, but **manual testing in the example app** is required for every PR.

Add or modify an example inside `example-app/` to:

- Demonstrate the new feature
- Reproduce the bug (before the fix)
- Confirm expected behavior

---

## ✅ Pull Request Checklist

Before submitting your PR, please ensure that:

- [ ] Code builds without errors or warnings
- [ ] You've tested on both iOS and Android (if applicable)
- [ ] Your changes are documented clearly in the PR description
- [ ] You've added or updated examples in `example-app/`
- [ ] You followed the code style and used Prettier

---

## 🛠 Common Tasks

### Add a new feature

1. Create or modify components in `/`
2. Add an example in `example-app/`
3. Test thoroughly
4. Open a PR with a clear description

### Report a bug

1. [Open an issue](https://github.com/entropyconquers/react-native-reanimated-dnd/issues/new)
2. Include reproduction steps and environment info
3. Optionally, include a minimal code snippet

---

## 💬 Join the Discussion

For questions, ideas, or discussions:

- Open a [GitHub Discussion](https://github.com/entropyconquers/react-native-reanimated-dnd/issues)
- Or post under an existing issue

---

## 💖 Acknowledgements

Thanks for being a part of the React Native Reanimated DnD community! Your help makes this library better for everyone.

Made with ❤️ for the React Native ecosystem.
