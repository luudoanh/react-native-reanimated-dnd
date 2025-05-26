---
sidebar_position: 1
---

# Basic Drag & Drop

Learn the fundamentals with simple drag-and-drop examples.

## Simple Drag & Drop

The most basic example - drag an item and drop it in a zone:

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DropProvider, Draggable, Droppable } from 'react-native-reanimated-dnd';

export default function BasicDragDrop() {
  const [dropCount, setDropCount] = useState(0);

  const handleDrop = (data) => {
    setDropCount(prev => prev + 1);
    Alert.alert('Success!', `${data.name} was dropped! Total drops: ${dropCount + 1}`);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider>
        <View style={styles.content}>
          <Text style={styles.title}>Basic Drag & Drop</Text>
          
          <Draggable data={{ id: '1', name: 'Blue Box' }}>
            <View style={[styles.draggable, { backgroundColor: '#2196F3' }]}>
              <Text style={styles.draggableText}>Drag me!</Text>
            </View>
          </Draggable>

          <Droppable onDrop={handleDrop}>
            <View style={styles.dropZone}>
              <Text style={styles.dropText}>Drop here</Text>
              <Text style={styles.dropCount}>Drops: {dropCount}</Text>
            </View>
          </Droppable>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  draggable: {
    width: 100,
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  draggableText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dropZone: {
    width: 200,
    height: 120,
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#999',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  dropCount: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});
```

## Multiple Items

Example with multiple draggable items and different drop zones:

```tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DropProvider, Draggable, Droppable } from 'react-native-reanimated-dnd';

interface Item {
  id: string;
  name: string;
  color: string;
  category: 'fruit' | 'vegetable';
}

export default function MultipleItems() {
  const [droppedItems, setDroppedItems] = useState<{[key: string]: Item[]}>({
    fruits: [],
    vegetables: []
  });

  const items: Item[] = [
    { id: '1', name: 'Apple', color: '#FF6B6B', category: 'fruit' },
    { id: '2', name: 'Carrot', color: '#FFA726', category: 'vegetable' },
    { id: '3', name: 'Banana', color: '#FFEB3B', category: 'fruit' },
    { id: '4', name: 'Broccoli', color: '#4CAF50', category: 'vegetable' },
  ];

  const handleDrop = (category: string) => (data: Item) => {
    if (data.category === category) {
      setDroppedItems(prev => ({
        ...prev,
        [category]: [...prev[category], data]
      }));
    } else {
      alert(`${data.name} doesn't belong in ${category}!`);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <DropProvider>
        <View style={styles.content}>
          <Text style={styles.title}>Sort Items by Category</Text>
          
          {/* Draggable Items */}
          <View style={styles.itemsContainer}>
            {items.map((item) => (
              <Draggable key={item.id} data={item}>
                <View style={[styles.item, { backgroundColor: item.color }]}>
                  <Text style={styles.itemText}>{item.name}</Text>
                </View>
              </Draggable>
            ))}
          </View>

          {/* Drop Zones */}
          <View style={styles.dropZonesContainer}>
            <Droppable onDrop={handleDrop('fruit')}>
              <View style={[styles.dropZone, styles.fruitZone]}>
                <Text style={styles.dropZoneTitle}>Fruits</Text>
                <Text style={styles.dropZoneCount}>
                  {droppedItems.fruits.length} items
                </Text>
              </View>
            </Droppable>

            <Droppable onDrop={handleDrop('vegetable')}>
              <View style={[styles.dropZone, styles.vegetableZone]}>
                <Text style={styles.dropZoneTitle}>Vegetables</Text>
                <Text style={styles.dropZoneCount}>
                  {droppedItems.vegetables.length} items
                </Text>
              </View>
            </Droppable>
          </View>
        </View>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 40,
  },
  item: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  itemText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  dropZonesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dropZone: {
    width: 140,
    height: 120,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  fruitZone: {
    backgroundColor: '#FFEBEE',
    borderColor: '#E91E63',
  },
  vegetableZone: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  dropZoneTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  dropZoneCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});
```

## Key Concepts

- **DropProvider**: Must wrap all draggable and droppable components
- **GestureHandlerRootView**: Required for gesture handling to work properly
- **Data Flow**: Data passed to `Draggable` is received by `Droppable` onDrop callback
- **Visual Feedback**: Use state to provide visual feedback during drag operations

## Next Steps

- [Advanced Features](./advanced-features) - Explore collision algorithms, animations, and constraints
- [Sortable Lists](./sortable-lists) - Learn about reorderable lists
- [Real-World Examples](./real-world-examples) - See practical implementations
