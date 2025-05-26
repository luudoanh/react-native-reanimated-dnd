---
sidebar_position: 1
---

# Welcome to React Native Reanimated DnD

**A drag and drop library that finally works on React Native** 🎉

React Native Reanimated DnD is a powerful, performant, and easy-to-use drag-and-drop library built specifically for React Native using Reanimated 3 and Gesture Handler.

## Why This Library?

If you've tried implementing drag-and-drop in React Native before, you know the pain:
- _Laggy animations that feel unnatural_
- _Complex setup with multiple dependencies_
- _Limited customization options_
- _Poor performance on lower-end devices_

**This library solves all of these problems.**

## ✨ Key Features

- 🚀 **Smooth 60fps animations** powered by Reanimated 3
- 📱 **Works on both iOS and Android** with consistent behavior
- 🎯 **Simple API** - get started in minutes, not hours
- 🎨 **Highly customizable** - style it exactly how you want
- 🔧 **TypeScript support** with full type safety
- 📦 **Lightweight** with minimal dependencies
- 🎪 **Rich examples** - 15+ interactive demos to learn from

## Quick Start

### Installation

```bash
npm install react-native-reanimated-dnd
# or
yarn add react-native-reanimated-dnd
```

### Basic Usage

```tsx
import { DragDropProvider, Draggable, Droppable } from 'react-native-reanimated-dnd';

function App() {
  return (
    <DragDropProvider>
      <Draggable id="item-1">
        <Text>Drag me!</Text>
      </Draggable>
      
      <Droppable id="drop-zone">
        <Text>Drop here!</Text>
      </Droppable>
    </DragDropProvider>
  );
}
```

## What's Next?

- 📖 **[View Examples](https://github.com/entropyconquers/react-native-reanimated-dnd/tree/main/example-app)** - See 15+ interactive examples
- 🚀 **[API Reference](/docs/api)** - Explore all components and hooks
- 💡 **[GitHub](https://github.com/entropyconquers/react-native-reanimated-dnd)** - Star the repo and contribute

---

Ready to build amazing drag-and-drop experiences? Let's get started! 🎯
