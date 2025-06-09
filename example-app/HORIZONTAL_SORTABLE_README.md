# Horizontal Sortable Implementation

## 🎯 Overview

This document provides a comprehensive guide to the new **Horizontal Sortable** implementation that has been added to complement the existing vertical sortable functionality. The horizontal sortable allows you to create drag-and-drop reorderable lists that scroll horizontally with gap support, padding management, and auto-scrolling when items are dragged outside the container bounds.

## 🏗️ Architecture

The horizontal sortable implementation mirrors the vertical implementation but is optimized for horizontal layouts:

### Core Components

- **`HorizontalSortable`** - Main container component (equivalent to `Sortable`)
- **`HorizontalSortableItem`** - Individual sortable item (equivalent to `SortableItem`)
- **`HorizontalSortableExample`** - Complete example implementation

### Hooks

- **`useHorizontalSortableList`** - Manages overall horizontal list state
- **`useHorizontalSortable`** - Handles individual item drag logic

### Utilities

- **`getItemXPosition()`** - Calculate X position with gap and padding
- **`getContentWidth()`** - Calculate total content width
- **`setHorizontalPosition()`** - Update item positions horizontally
- **`setHorizontalAutoScroll()`** - Manage horizontal auto-scrolling

## 🚀 Quick Start

### Basic Usage

```tsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  HorizontalSortable,
  HorizontalSortableItem,
  HorizontalSortableRenderItemProps,
} from "./path-to-sortable";

interface Tag {
  id: string;
  label: string;
  color: string;
}

function TagList() {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", label: "React", color: "#61dafb" },
    { id: "2", label: "TypeScript", color: "#3178c6" },
    { id: "3", label: "React Native", color: "#0fa5e9" },
  ]);

  const renderTag = ({
    item,
    id,
    positions,
    ...props
  }: HorizontalSortableRenderItemProps<Tag>) => (
    <HorizontalSortableItem key={id} id={id} positions={positions} {...props}>
      <View style={[styles.tagItem, { backgroundColor: item.color }]}>
        <Text style={styles.tagText}>{item.label}</Text>
      </View>
    </HorizontalSortableItem>
  );

  return (
    <HorizontalSortable
      data={tags}
      renderItem={renderTag}
      itemWidth={120}
      gap={12}
      paddingHorizontal={16}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
  },
  tagItem: {
    width: 120,
    height: 60,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    color: "white",
    fontWeight: "bold",
  },
});
```

## 🎨 Key Features

### ✅ Gap Support

Unlike the vertical implementation, horizontal sortable includes built-in gap support:

```tsx
<HorizontalSortable
  data={items}
  renderItem={renderItem}
  itemWidth={100}
  gap={16} // 16px gap between items
  paddingHorizontal={20}
/>
```

### ✅ Container Padding

Proper padding management that affects positioning calculations:

```tsx
<HorizontalSortable
  data={items}
  renderItem={renderItem}
  itemWidth={100}
  paddingHorizontal={24} // 24px padding on left and right
/>
```

### ✅ Auto-Scroll

Auto-scrolling triggers when dragging items near the left or right edges:

```tsx
// Auto-scroll is handled automatically
// Scrolls left when dragging near left edge
// Scrolls right when dragging near right edge
```

### ✅ Drag Handles

Full support for drag handles just like the vertical implementation:

```tsx
const renderItem = ({ item, ...props }) => (
  <HorizontalSortableItem {...props}>
    <View style={styles.itemContent}>
      <Text>{item.title}</Text>

      {/* Only this handle can initiate dragging */}
      <HorizontalSortableItem.Handle style={styles.dragHandle}>
        <Icon name="drag-handle" size={16} />
      </HorizontalSortableItem.Handle>
    </View>
  </HorizontalSortableItem>
);
```

## 📋 API Reference

### HorizontalSortable Props

| Prop                    | Type                      | Required | Default             | Description                     |
| ----------------------- | ------------------------- | -------- | ------------------- | ------------------------------- |
| `data`                  | `TData[]`                 | ✅       | -                   | Array of data items             |
| `renderItem`            | `(props) => ReactNode`    | ✅       | -                   | Function to render each item    |
| `itemWidth`             | `number`                  | ✅       | -                   | Width of each item in pixels    |
| `gap`                   | `number`                  | ❌       | `0`                 | Gap between items in pixels     |
| `paddingHorizontal`     | `number`                  | ❌       | `0`                 | Horizontal padding of container |
| `style`                 | `StyleProp<ViewStyle>`    | ❌       | -                   | Style for scroll view           |
| `contentContainerStyle` | `StyleProp<ViewStyle>`    | ❌       | -                   | Style for content container     |
| `itemKeyExtractor`      | `(item, index) => string` | ❌       | `(item) => item.id` | Key extraction function         |

### HorizontalSortableItem Props

| Prop                  | Type                                  | Required | Default | Description               |
| --------------------- | ------------------------------------- | -------- | ------- | ------------------------- |
| `id`                  | `string`                              | ✅       | -       | Unique identifier         |
| `data`                | `T`                                   | ✅       | -       | Item data                 |
| `positions`           | `SharedValue`                         | ✅       | -       | Positions shared value    |
| `leftBound`           | `SharedValue`                         | ✅       | -       | Left scroll bound         |
| `autoScrollDirection` | `SharedValue`                         | ✅       | -       | Auto-scroll direction     |
| `itemsCount`          | `number`                              | ✅       | -       | Total items count         |
| `itemWidth`           | `number`                              | ✅       | -       | Item width                |
| `gap`                 | `number`                              | ❌       | `0`     | Gap between items         |
| `paddingHorizontal`   | `number`                              | ❌       | `0`     | Container padding         |
| `containerWidth`      | `number`                              | ❌       | `500`   | Container width           |
| `children`            | `ReactNode`                           | ✅       | -       | Item content              |
| `style`               | `StyleProp<ViewStyle>`                | ❌       | -       | Item container style      |
| `animatedStyle`       | `StyleProp<ViewStyle>`                | ❌       | -       | Additional animated style |
| `onMove`              | `(id, from, to) => void`              | ❌       | -       | Position change callback  |
| `onDragStart`         | `(id, position) => void`              | ❌       | -       | Drag start callback       |
| `onDrop`              | `(id, position) => void`              | ❌       | -       | Drag end callback         |
| `onDragging`          | `(id, overItemId, xPosition) => void` | ❌       | -       | Dragging callback         |

## 🔄 Migration from Vertical

If you're familiar with the vertical sortable, here are the key differences:

| Vertical                                | Horizontal                              | Notes                     |
| --------------------------------------- | --------------------------------------- | ------------------------- |
| `itemHeight`                            | `itemWidth`                             | Dimension property        |
| `ScrollDirection.Up/Down`               | `HorizontalScrollDirection.Left/Right`  | Scroll directions         |
| `onDragging(id, overItemId, yPosition)` | `onDragging(id, overItemId, xPosition)` | Position callback         |
| No gap support                          | `gap` prop                              | Built-in gap support      |
| Vertical auto-scroll                    | Horizontal auto-scroll                  | Direction-aware scrolling |

## 🎯 Advanced Examples

### With Reordering Logic

```tsx
function ReorderableTagList() {
  const [tags, setTags] = useState(initialTags);

  const handleReorder = useCallback((id: string, from: number, to: number) => {
    setTags((prevTags) => {
      const newTags = [...prevTags];
      const [movedTag] = newTags.splice(from, 1);
      newTags.splice(to, 0, movedTag);
      return newTags;
    });
  }, []);

  const renderTag = ({ item, ...props }) => (
    <HorizontalSortableItem {...props} onMove={handleReorder}>
      <TagComponent tag={item} />
    </HorizontalSortableItem>
  );

  return (
    <HorizontalSortable
      data={tags}
      renderItem={renderTag}
      itemWidth={140}
      gap={16}
      paddingHorizontal={20}
    />
  );
}
```

### With State Tracking

```tsx
function StatefulTagList() {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const renderTag = ({ item, ...props }) => (
    <HorizontalSortableItem
      {...props}
      onDragStart={(id) => {
        setDraggingId(id);
        hapticFeedback();
      }}
      onDrop={() => {
        setDraggingId(null);
      }}
      style={[styles.tagItem, draggingId === item.id && styles.dragging]}
    >
      <TagComponent tag={item} isDragging={draggingId === item.id} />
    </HorizontalSortableItem>
  );

  return (
    <HorizontalSortable
      data={tags}
      renderItem={renderTag}
      itemWidth={120}
      gap={12}
    />
  );
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Items not positioning correctly**

   - Ensure `itemWidth` matches your actual item width
   - Check that gap calculations are correct
   - Verify container has sufficient width

2. **Auto-scroll not working**

   - Make sure `containerWidth` is set correctly
   - Ensure the ScrollView has proper bounds
   - Check that items are being dragged to the edges

3. **Gestures not working**
   - Verify `GestureHandlerRootView` wraps your app
   - Ensure React Native Reanimated is properly configured
   - Check for conflicting gesture handlers

### Performance Tips

1. **Optimize rendering**

   ```tsx
   const renderItem = useCallback(
     (props) => {
       // Your render logic
     },
     [dependencies]
   );
   ```

2. **Limit item count**

   - Consider virtualization for large lists
   - Use pagination or infinite scroll

3. **Minimize re-renders**
   - Use `React.memo` for item components
   - Optimize state updates

## 🔧 Technical Implementation Details

### Position Calculations

The horizontal implementation uses these key formulas:

```typescript
// Item X position including gap and padding
const xPosition = paddingHorizontal + position * (itemWidth + gap);

// Content width calculation
const contentWidth =
  itemsCount * itemWidth + (itemsCount - 1) * gap + paddingHorizontal * 2;

// Position from X coordinate
const position = Math.floor((x - paddingHorizontal) / (itemWidth + gap));
```

### Auto-Scroll Logic

Auto-scrolling is triggered when dragging within a threshold of the container edges:

```typescript
if (positionX <= leftBound + scrollThreshold) {
  autoScroll.value = HorizontalScrollDirection.Left;
} else if (positionX >= rightBound - scrollThreshold) {
  autoScroll.value = HorizontalScrollDirection.Right;
} else {
  autoScroll.value = HorizontalScrollDirection.None;
}
```

## 🎉 Complete Example

See `components/HorizontalSortableExample.tsx` for a complete, fully-featured implementation with:

- ✅ Technology tags with colors and categories
- ✅ Toggle between full-item and handle-only dragging
- ✅ Visual feedback for popular items
- ✅ Proper gap and padding management
- ✅ Auto-scrolling demonstration
- ✅ State tracking and callbacks
- ✅ Responsive design
- ✅ Platform-aware features

## 📚 Further Reading

- [React Native Reanimated Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler Documentation](https://docs.swmansion.com/react-native-gesture-handler/)
- [Vertical Sortable Implementation](./components/SortableExample.tsx)

---

🎨 **Built with care for the React Native community** 🚀
