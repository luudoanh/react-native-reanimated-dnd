# Contributing to React Native Reanimated DnD 🤝

First off, thank you for considering contributing to React Native Reanimated DnD! It's people like you that make this library better for the entire React Native community.

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [How to Contribute](#-how-to-contribute)
- [Pull Request Process](#-pull-request-process)
- [Development Guidelines](#-development-guidelines)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Issue Guidelines](#-issue-guidelines)
- [Community](#-community)

## 🤖 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- **Be respectful** - Treat everyone with respect and kindness
- **Be inclusive** - Welcome newcomers and help them learn
- **Be constructive** - Provide helpful feedback and suggestions
- **Be patient** - Remember that everyone has different skill levels
- **Be collaborative** - Work together towards common goals

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **React Native CLI** or **Expo CLI**
- **Xcode** (for iOS development)
- **Android Studio** (for Android development)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-native-reanimated-dnd.git
   cd react-native-reanimated-dnd
   ```
3. **Add the original repository** as upstream:
   ```bash
   git remote add upstream https://github.com/entropyconquers/react-native-reanimated-dnd.git
   ```

## 🛠️ Development Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up the example app:**

   ```bash
   cd example-app
   npm install
   ```

3. **Run the example app:**

   ```bash
   # iOS
   npx expo run:ios

   # Android
   npx expo run:android
   ```

4. **Start developing:**
   - Make changes to the library code in the root directory
   - Test your changes using the example app
   - The example app automatically links to your local library code

## 🎯 How to Contribute

### 🐛 Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates.

**When reporting bugs, include:**

- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, React Native version, library version)
- **Code snippet** demonstrating the issue
- **Screenshots or videos** if applicable

**Use this template:**

````markdown
## Bug Description

A clear description of what the bug is.

## To Reproduce

Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior

A clear description of what you expected to happen.

## Environment

- OS: [e.g. iOS 15.0, Android 12]
- React Native Version: [e.g. 0.72.0]
- Library Version: [e.g. 1.0.0]
- Device: [e.g. iPhone 14, Pixel 6]

## Code Snippet

```tsx
// Minimal code that reproduces the issue
```
````

## Additional Context

Any other context about the problem here.

````

### ✨ Suggesting Features

We love feature suggestions! Before suggesting a new feature:

- **Check existing issues** to see if it's already been suggested
- **Consider the scope** - Does it fit the library's purpose?
- **Think about implementation** - Is it technically feasible?

**Use this template:**
```markdown
## Feature Request

**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Any other context, mockups, or examples.

**Implementation ideas**
If you have ideas about how this could be implemented.
````

### 🔧 Code Contributions

1. **Create a new branch** for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes** following our development guidelines

3. **Test thoroughly** on both iOS and Android

4. **Commit your changes** with clear, descriptive messages:

   ```bash
   git commit -m "feat: add collision detection for sortable grids"
   # or
   git commit -m "fix: resolve memory leak in draggable component"
   ```

5. **Push to your fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Pull Request Process

### Before Submitting

- [ ] **Test on both platforms** (iOS and Android)
- [ ] **Update documentation** if needed
- [ ] **Add/update tests** for new functionality
- [ ] **Follow code style** guidelines
- [ ] **Ensure no breaking changes** (or document them clearly)

### Pull Request Template

```markdown
## Description

Brief description of changes and motivation.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Added/updated tests
- [ ] All existing tests pass

## Screenshots/Videos

If applicable, add screenshots or videos demonstrating the changes.

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] New and existing unit tests pass locally with my changes
```

### Review Process

1. **Automated checks** will run (if configured)
2. **Maintainers will review** your PR
3. **Address feedback** by making additional commits
4. **PR will be merged** once approved

## 📋 Development Guidelines

### Code Style

- **Use TypeScript** for all new code
- **Follow React/React Native** best practices
- **Use meaningful variable** and function names
- **Comment complex logic** and algorithms
- **Prefer functional components** and hooks
- **Use Reanimated worklets** for animations

### File Structure

```
src/
├── components/          # React components
├── hooks/              # Custom hooks
├── types/              # TypeScript definitions
├── utils/              # Utility functions
├── constants/          # Constants and enums
└── index.ts           # Main exports
```

### Naming Conventions

- **Components**: PascalCase (`Draggable`, `SortableItem`)
- **Hooks**: camelCase starting with 'use' (`useDraggable`, `useSortable`)
- **Types/Interfaces**: PascalCase (`DraggableProps`, `CollisionAlgorithm`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_ANIMATION_DURATION`)
- **Files**: kebab-case (`sortable-item.tsx`, `collision-utils.ts`)

### Performance Guidelines

- **Use worklets** for Reanimated functions
- **Minimize re-renders** with proper memoization
- **Optimize animations** for 60fps performance
- **Use shared values** for frequently updated state
- **Avoid heavy computations** on the UI thread

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Testing Guidelines

- **Write tests** for new features and bug fixes
- **Test edge cases** and error scenarios
- **Use meaningful test descriptions**
- **Mock external dependencies** when necessary
- **Test both success and failure paths**

### Test Structure

```typescript
describe("Draggable Component", () => {
  describe("when dragging is initiated", () => {
    it("should call onDragStart callback", () => {
      // Test implementation
    });

    it("should update position correctly", () => {
      // Test implementation
    });
  });
});
```

## 📚 Documentation

### Code Documentation

- **Document public APIs** with JSDoc comments
- **Include usage examples** in documentation
- **Document complex algorithms** and edge cases
- **Keep README.md updated** with new features

### JSDoc Example

````typescript
/**
 * Makes a component draggable with customizable behavior
 *
 * @param data - Data associated with the draggable item
 * @param onDragStart - Callback called when dragging starts
 * @param onDragEnd - Callback called when dragging ends
 * @param collisionAlgorithm - Algorithm used for collision detection
 *
 * @example
 * ```tsx
 * <Draggable
 *   data={{ id: '1', title: 'Item' }}
 *   onDragStart={(data) => console.log('Started dragging', data)}
 *   collisionAlgorithm="intersect"
 * >
 *   <Text>Drag me!</Text>
 * </Draggable>
 * ```
 */
````

## 🐛 Issue Guidelines

### Before Creating Issues

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** and examples
3. **Try the latest version** of the library
4. **Prepare a minimal reproduction** example

### Issue Types

- **🐛 Bug Report** - Something isn't working correctly
- **✨ Feature Request** - Suggest a new feature or enhancement
- **📚 Documentation** - Improvements to documentation
- **❓ Question** - Ask for help or clarification
- **🔧 Maintenance** - Internal improvements or refactoring

### Issue Labels

We use labels to categorize and prioritize issues:

- `bug` - Confirmed bugs
- `enhancement` - New features or improvements
- `documentation` - Documentation related
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority: high` - Critical issues
- `priority: low` - Nice to have improvements

## 🏆 Recognition

### Contributors

All contributors will be recognized in our:

- **README.md** contributors section
- **Release notes** for their contributions
- **Social media** shoutouts for significant contributions

### Types of Contributions

We value all types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🧪 **Testing and QA**
- 🎨 **Design and UX suggestions**
- 🌍 **Community building**
- 💬 **Answering questions**
- 📝 **Writing tutorials or blog posts**

## 🌍 Community

### Getting Help

- **GitHub Discussions** - For questions and general discussions
- **Issues** - For bug reports and feature requests
- **Discord** - Real-time chat with the community (if available)

### Stay Connected

- **Star the repository** to show your support
- **Watch releases** to stay updated
- **Follow the maintainers** on social media
- **Share your projects** built with the library

## 🎉 First Time Contributors

Welcome! Here are some ways to get started:

1. **Look for `good first issue` labels** in the issues
2. **Improve documentation** - Fix typos, add examples
3. **Add tests** for existing functionality
4. **Try reproducing bugs** and provide more details
5. **Share your feedback** on the developer experience

### Getting Familiar

1. **Read the README** and try the examples
2. **Explore the source code** to understand the architecture
3. **Run the example app** and play with different features
4. **Ask questions** in discussions or issues

## 📞 Contact

- **Maintainer**: [Vishesh Raheja](https://github.com/entropyconquers)
- **Email**: [Create an issue for direct contact]
- **Twitter**: [@entropyconquers] (if available)

---

Thank you for contributing to React Native Reanimated DnD! Together, we're building the best drag-and-drop solution for React Native. 🚀

## 💖 Support the Project

If this library has helped you, consider:

- ⭐ **Starring the repository**
- 🐛 **Reporting bugs you find**
- 💡 **Suggesting improvements**
- 📝 **Improving documentation**
- ☕ **Buying the maintainer a coffee**

Every contribution, no matter how small, makes a difference! 🙏
