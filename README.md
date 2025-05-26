# React Native Reanimated DnD 🎯

<div align="center">

**A drag-and-drop library that _finally_ works on React Native** ✨

_Powerful, performant, and built for the modern React Native developer_

[![npm version](https://badge.fury.io/js/react-native-reanimated-dnd.svg)](https://badge.fury.io/js/react-native-reanimated-dnd)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.60+-green.svg)](https://reactnative.dev/)

</div>

---

## 🚀 Why This Library?

After countless attempts with drag-and-drop solutions that don't work or are simply outdated, this is something that _finally_ works. And it is not just another DnD library, but a **complete ecosystem** built from the ground up for React Native, offering a **best-in-class developer experience** and **production-ready performance**.

**Highly feature-packed** with every interaction pattern you'll ever need, yet **simple enough** to get started in minutes. Built for developers who demand both power and simplicity.

## ✨ Features

- 🚀 **High Performance** - Built with Reanimated 3 for buttery-smooth 60fps animations
- 🎯 **Flexible API** - From simple drag-and-drop to complex sortable lists
- 📱 **React Native First** - Designed specifically for mobile, not ported from web
- 🔧 **TypeScript Ready** - Full type safety with comprehensive definitions
- 🎨 **Infinitely Customizable** - Every animation, behavior, and style is configurable
- 📦 **Complete Component Suite** - Draggable, Droppable, Sortable, and more
- 🎪 **Smart Collision Detection** - Multiple algorithms (center, intersect, contain)
- 📜 **Sortable Lists** - Drag and drop to sort a Vertical List, also
  supports Automatic scrolling for out of screen dragging
- 🎭 **Drag Handles** - Precise control with dedicated drag areas
- 🎬 **Custom Animations** - Spring, timing, or bring your own animation functions
- 📐 **Pixel-Perfect Positioning** - 9-point alignment system with custom offsets
- 📦 **Boundary Constraints** - Keep draggables within specific areas
- ⚡ **State Management** - Complete lifecycle tracking and callbacks
- 🎯 **Developer Experience** - Intuitive APIs, helpful warnings, and extensive examples

## 📱 Interactive Examples

**See it in action!** A comprehensive example app with **15 interactive demos** showcasing every feature and use case.

<div align="center">

### 🎮 [**Explore the Example App →**](./example-app/README.md)

_From basic drag-and-drop to advanced collision detection and custom animations_

</div>

The example app includes:

- 🎵 **Sortable Music Queue** - Complete list reordering with handles
- 🎯 **Collision Detection** - Different algorithms in action
- 🎬 **Custom Animations** - Spring, timing, and easing variations
- 📦 **Boundary Constraints** - Axis-locked and bounded dragging
- ✨ **Visual Feedback** - Active styles and state management
- ⚙️ **Advanced Patterns** - Custom implementations and hooks

## 🚀 Installation

```bash
npm install react-native-reanimated-dnd
```

### Peer Dependencies

```bash
npm install react-native-reanimated react-native-gesture-handler
```

Follow the setup guides:

- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/installation)

## 🏃‍♂️ Quick Start

### Basic Draggable

```tsx
import React from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Draggable, DropProvider } from "react-native-reanimated-dnd";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        <View style={{ flex: 1, padding: 20 }}>
          <Draggable data={{ id: "1", title: "Drag me!" }}>
            <View
              style={{
                padding: 20,
                backgroundColor: "#007AFF",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white" }}>Drag me around!</Text>
            </View>
          </Draggable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Drag & Drop with Multiple Zones

```tsx
import React from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Draggable,
  Droppable,
  DropProvider,
} from "react-native-reanimated-dnd";

export default function DragDropExample() {
  const handleDrop = (data: any) => {
    console.log("Item dropped:", data);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DropProvider>
        <View style={{ flex: 1, padding: 20 }}>
          {/* Draggable Item */}
          <Draggable data={{ id: "1", title: "Drag me!" }}>
            <View style={styles.draggableItem}>
              <Text>📦 Drag me to a zone</Text>
            </View>
          </Draggable>

          {/* Drop Zones */}
          <Droppable onDrop={handleDrop}>
            <View style={styles.dropZone}>
              <Text>🎯 Drop Zone 1</Text>
            </View>
          </Droppable>

          <Droppable onDrop={handleDrop}>
            <View style={styles.dropZone}>
              <Text>🎯 Drop Zone 2</Text>
            </View>
          </Droppable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}
```

### Sortable List

```tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Sortable, SortableItem } from "react-native-reanimated-dnd";

interface Task {
  id: string;
  title: string;
}

export default function SortableExample() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Learn React Native" },
    { id: "2", title: "Build an app" },
    { id: "3", title: "Deploy to store" },
  ]);

  const renderTask = ({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={(itemId, from, to) => {
        const newTasks = [...tasks];
        const [movedTask] = newTasks.splice(from, 1);
        newTasks.splice(to, 0, movedTask);
        setTasks(newTasks);
      }}
    >
      <View style={styles.taskItem}>
        <Text>{item.title}</Text>

        {/* Drag Handle */}
        <SortableItem.Handle style={styles.dragHandle}>
          <Text>⋮⋮</Text>
        </SortableItem.Handle>
      </View>
    </SortableItem>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Sortable
        data={tasks}
        renderItem={renderTask}
        itemHeight={60}
        style={{ flex: 1, padding: 16 }}
      />
    </GestureHandlerRootView>
  );
}
```

## 📚 API Reference

### Components

#### `<Draggable>`

Makes any component draggable with extensive customization options.

```tsx
<Draggable
  data={any}                                    // Data associated with the item
  onDragStart={(data) => void}                  // Called when dragging starts
  onDragEnd={(data) => void}                    // Called when dragging ends
  onDragging={(position) => void}               // Called during dragging
  onStateChange={(state) => void}               // Called on state changes
  dragDisabled={boolean}                        // Disable dragging
  collisionAlgorithm="center|intersect|contain" // Collision detection method
  dragAxis="x|y|both"                          // Constrain movement axis
  dragBoundsRef={RefObject}                    // Boundary container reference
  animationFunction={(toValue) => Animation}    // Custom animation function
  style={StyleProp<ViewStyle>}                 // Component styling
>
  {children}
</Draggable>
```

#### `<Droppable>`

Creates drop zones with visual feedback and capacity management.

```tsx
<Droppable
  onDrop={(data) => void}                      // Called when item is dropped
  onActiveChange={(isActive) => void}          // Called on hover state change
  dropDisabled={boolean}                       // Disable drop functionality
  dropAlignment="top-left|center|bottom-right|..." // Drop positioning
  dropOffset={{ x: number, y: number }}       // Position offset
  activeStyle={StyleProp<ViewStyle>}           // Style when active
  capacity={number}                            // Maximum items allowed
  droppableId={string}                         // Unique identifier
>
  {children}
</Droppable>
```

#### `<Sortable>`

High-level component for sortable lists with auto-scrolling.

```tsx
<Sortable
  data={Array<{ id: string }>} // Array of items to render
  renderItem={(props) => ReactNode} // Render function for items
  itemHeight={number} // Height of each item
  itemKeyExtractor={(item) => string} // Custom key extractor
  style={StyleProp<ViewStyle>} // List container style
  contentContainerStyle={StyleProp<ViewStyle>} // Content container style
/>
```

#### `<SortableItem>`

Individual item within a sortable list with gesture handling.

```tsx
<SortableItem
  id={string}                                 // Unique identifier
  data={any}                                  // Item data
  positions={SharedValue}                     // Position tracking
  onMove={(id, from, to) => void}            // Called when item moves
  onDragStart={(id, position) => void}       // Called when dragging starts
  onDrop={(id, position) => void}            // Called when item is dropped
  onDragging={(id, overItemId, y) => void}   // Called during dragging
  style={StyleProp<ViewStyle>}               // Item styling
  animatedStyle={StyleProp<AnimatedStyle>}   // Animated styling
>
  {children}
</SortableItem>
```

### Hooks

#### `useDraggable(options)`

Core hook for implementing draggable functionality.

#### `useDroppable(options)`

Core hook for implementing droppable functionality.

#### `useSortable(options)`

Hook for individual sortable items with position management.

#### `useSortableList(options)`

Hook for managing entire sortable lists with auto-scrolling.

### Context

#### `<DropProvider>`

Required context provider that manages global drag-and-drop state.

```tsx
<DropProvider>{/* All draggable and droppable components */}</DropProvider>
```

### Types & Enums

#### `DraggableState`

```tsx
enum DraggableState {
  IDLE = "idle",
  DRAGGING = "dragging",
  ANIMATING = "animating",
}
```

#### `CollisionAlgorithm`

```tsx
type CollisionAlgorithm = "center" | "intersect" | "contain";
```

#### `DropAlignment`

```tsx
type DropAlignment =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";
```

## 🎨 Advanced Usage

### Custom Animations

```tsx
import { withTiming, withSpring, Easing } from "react-native-reanimated";

// Smooth timing animation
const smoothAnimation = (toValue) => {
  "worklet";
  return withTiming(toValue, {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });
};

// Spring animation
const springAnimation = (toValue) => {
  "worklet";
  return withSpring(toValue, {
    damping: 15,
    stiffness: 150,
  });
};

<Draggable animationFunction={springAnimation}>{/* content */}</Draggable>;
```

### Collision Detection Strategies

```tsx
// Precise center-point collision
<Draggable collisionAlgorithm="center">
  {/* Requires center point to be over drop zone */}
</Draggable>

// Forgiving intersection collision (default)
<Draggable collisionAlgorithm="intersect">
  {/* Any overlap triggers collision */}
</Draggable>

// Strict containment collision
<Draggable collisionAlgorithm="contain">
  {/* Entire draggable must be within drop zone */}
</Draggable>
```

### Drag Handles

```tsx
<SortableItem id={item.id} {...props}>
  <View style={styles.itemContainer}>
    <Text>{item.title}</Text>

    {/* Only this handle area can initiate dragging */}
    <SortableItem.Handle style={styles.dragHandle}>
      <View style={styles.handleIcon}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </SortableItem.Handle>
  </View>
</SortableItem>
```

### Bounded Dragging

```tsx
const containerRef = useRef<View>(null);

<View ref={containerRef} style={styles.container}>
  <Draggable
    data={data}
    dragBoundsRef={containerRef}
    dragAxis="x" // Constrain to horizontal movement
  >
    {/* content */}
  </Draggable>
</View>;
```

### Drop Zone Capacity

```tsx
<Droppable
  capacity={3}
  onDrop={(data) => {
    if (currentItems.length < 3) {
      addItem(data);
    }
  }}
  activeStyle={{
    backgroundColor: currentItems.length < 3 ? "#e8f5e8" : "#ffe8e8",
  }}
>
  <Text>Drop Zone ({currentItems.length}/3)</Text>
</Droppable>
```

## 🏃‍♂️ Running the Example App

1. Clone the repository:

```bash
git clone https://github.com/entropyconquers/react-native-reanimated-dnd.git
cd react-native-reanimated-dnd
```

2. Install dependencies:

```bash
npm install
cd example-app
npm install
```

3. Run the example app:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

The example app includes all 15 interactive examples showcasing every feature of the library.

## 🤝 Contributing

Contributions are always welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Vishesh Raheja](https://github.com/entropyconquers)

## 🙏 Acknowledgments

- Built with [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for smooth 60fps animations
- Gesture handling powered by [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)
- Inspired by the React ecosystem's drag-and-drop libraries
- Special thanks to the React Native community for feedback and contributions

---

<div align="center">

**Made with ❤️ for the React Native community**

[⭐ Star on GitHub](https://github.com/entropyconquers/react-native-reanimated-dnd) • [📱 Try the Demo](https://github.com/entropyconquers/react-native-reanimated-dnd/tree/main/example-app) • [📖 Documentation](https://github.com/entropyconquers/react-native-reanimated-dnd#readme)

</div>
