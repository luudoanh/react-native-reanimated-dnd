---
sidebar_position: 3
---

# Sortable

The `Sortable` component creates reorderable lists with smooth animations, auto-scrolling, and gesture handling for intuitive drag-and-drop reordering.

## Overview

The Sortable component provides a complete solution for sortable lists, handling all the complex state management, gesture handling, and animations internally. It renders a scrollable list where items can be dragged to reorder them with smooth animations and auto-scrolling support when dragging near edges.

## Basic Usage

```tsx
import { Sortable, SortableItem } from 'react-native-reanimated-dnd';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Learn React Native', completed: false },
    { id: '2', title: 'Build an app', completed: false },
    { id: '3', title: 'Deploy to store', completed: false }
  ]);

  const renderTask = ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View style={styles.taskItem}>
        <Text>{item.title}</Text>
        <Text>{item.completed ? '✓' : '○'}</Text>
      </View>
    </SortableItem>
  );

  return (
    <Sortable
      data={tasks}
      renderItem={renderTask}
      itemHeight={60}
      style={styles.list}
    />
  );
}
```

## Props Reference

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `TData[]` | **Required** | Array of data items (must have `id` property) |
| `renderItem` | `RenderItemFunction` | **Required** | Function to render each item |
| `itemHeight` | `number` | **Required** | Height of each item in pixels |
| `style` | `StyleProp<ViewStyle>` | - | Style for the container |
| `contentContainerStyle` | `StyleProp<ViewStyle>` | - | Style for the scroll content |

### Advanced Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `itemKeyExtractor` | `(item: TData) => string` | `(item) => item.id` | Function to extract unique key from item |

## Render Item Function

The `renderItem` function receives props needed for sortable functionality:

```tsx
interface SortableRenderItemProps<TData> {
  item: TData;                    // The data item
  id: string;                     // Unique identifier
  positions: SharedValue<number[]>; // Shared value for positions
  lowerBound: SharedValue<number>;  // Lower scroll bound
  autoScrollDirection: SharedValue<ScrollDirection>; // Auto-scroll state
  itemsCount: number;             // Total number of items
  itemHeight: number;             // Height of each item
  containerHeight: SharedValue<number>; // Container height
}

type RenderItemFunction<TData> = (props: SortableRenderItemProps<TData>) => React.ReactElement;
```

## Examples

### Basic Task List

```tsx
function BasicTaskList() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Design UI mockups', priority: 'high', completed: false },
    { id: '2', title: 'Implement authentication', priority: 'medium', completed: false },
    { id: '3', title: 'Write unit tests', priority: 'low', completed: false },
    { id: '4', title: 'Deploy to staging', priority: 'medium', completed: true },
  ]);

  const renderTask = ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View style={[
        styles.taskItem,
        item.completed && styles.completedTask,
        getPriorityStyle(item.priority)
      ]}>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskPriority}>{item.priority}</Text>
        </View>
        <View style={styles.taskStatus}>
          <Text>{item.completed ? '✅' : '⏳'}</Text>
        </View>
      </View>
    </SortableItem>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks ({tasks.length})</Text>
      <Sortable
        data={tasks}
        renderItem={renderTask}
        itemHeight={80}
        style={styles.sortableList}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    backgroundColor: 'white',
  },
  sortableList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedTask: {
    opacity: 0.6,
    backgroundColor: '#f0f0f0',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskPriority: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  taskStatus: {
    marginLeft: 12,
  },
});

function getPriorityStyle(priority) {
  switch (priority) {
    case 'high':
      return { borderLeftColor: '#ef4444', borderLeftWidth: 4 };
    case 'medium':
      return { borderLeftColor: '#f59e0b', borderLeftWidth: 4 };
    case 'low':
      return { borderLeftColor: '#10b981', borderLeftWidth: 4 };
    default:
      return {};
  }
}
```

### Sortable List with Callbacks

```tsx
function AdvancedTaskList() {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedTask, setDraggedTask] = useState(null);

  const renderTask = ({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={(itemId, from, to) => {
        // Update data when items are reordered
        const newTasks = [...tasks];
        const [movedTask] = newTasks.splice(from, 1);
        newTasks.splice(to, 0, movedTask);
        setTasks(newTasks);

        // Analytics
        analytics.track('task_reordered', { 
          taskId: itemId, 
          from, 
          to,
          taskTitle: movedTask.title 
        });

        // Auto-save to backend
        saveTasks(newTasks);
      }}
      onDragStart={(itemId) => {
        const task = tasks.find(t => t.id === itemId);
        setDraggedTask(task);
        hapticFeedback();
        
        // Show global drag feedback
        showDragOverlay(task);
      }}
      onDrop={(itemId) => {
        setDraggedTask(null);
        hideDragOverlay();
        
        // Success feedback
        showToast('Task reordered successfully');
      }}
      onDragging={(itemId, overItemId, yPosition) => {
        if (overItemId) {
          // Highlight the item being hovered over
          highlightItem(overItemId);
        }
        
        // Update drag position for global overlay
        updateDragPosition(yPosition);
      }}
    >
      <Animated.View style={[
        styles.taskItem,
        item.priority === 'high' && styles.highPriority,
        draggedTask?.id === item.id && styles.draggingItem
      ]}>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <Text style={styles.taskDescription}>{item.description}</Text>
          <Text style={styles.taskDue}>Due: {item.dueDate}</Text>
        </View>
        <View style={styles.taskMeta}>
          <Text style={styles.taskPriority}>{item.priority}</Text>
          <Text style={styles.taskAssignee}>{item.assignee}</Text>
        </View>
      </Animated.View>
    </SortableItem>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Project Tasks</Text>
      {draggedTask && (
        <Text style={styles.dragIndicator}>
          Dragging: {draggedTask.title}
        </Text>
      )}
      <Sortable
        data={tasks}
        renderItem={renderTask}
        itemHeight={100}
        style={styles.sortableList}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
```

### Sortable List with Drag Handles

```tsx
function SortableWithHandles() {
  const [items, setItems] = useState([
    { id: '1', title: 'First Item', subtitle: 'Description for first item' },
    { id: '2', title: 'Second Item', subtitle: 'Description for second item' },
    { id: '3', title: 'Third Item', subtitle: 'Description for third item' },
  ]);

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
        </View>

        {/* Only this handle area can initiate dragging */}
        <SortableItem.Handle style={styles.dragHandle}>
          <View style={styles.handleIcon}>
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
            <View style={styles.handleDot} />
          </View>
        </SortableItem.Handle>
      </View>
    </SortableItem>
  );

  return (
    <Sortable
      data={items}
      renderItem={renderItem}
      itemHeight={70}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  dragHandle: {
    padding: 8,
    marginLeft: 12,
  },
  handleIcon: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  handleDot: {
    width: 3,
    height: 3,
    backgroundColor: '#999',
    borderRadius: 1.5,
  },
});
```

### Custom Key Extractor

```tsx
interface CustomItem {
  uuid: string;  // Using uuid instead of id
  name: string;
  order: number;
  category: string;
}

function CustomSortableList() {
  const [items, setItems] = useState<CustomItem[]>([
    { uuid: 'a1b2c3', name: 'Item Alpha', order: 1, category: 'work' },
    { uuid: 'd4e5f6', name: 'Item Beta', order: 2, category: 'personal' },
    { uuid: 'g7h8i9', name: 'Item Gamma', order: 3, category: 'work' },
  ]);

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View style={styles.customItem}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemOrder}>Order: {item.order}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
    </SortableItem>
  );

  return (
    <Sortable
      data={items}
      renderItem={renderItem}
      itemHeight={60}
      itemKeyExtractor={(item) => item.uuid} // Use uuid instead of id
      style={styles.list}
    />
  );
}
```

### Sortable with State Management

```tsx
function StateManagedSortable() {
  const [items, setItems] = useState(initialItems);
  const [isReordering, setIsReordering] = useState(false);
  const [lastReorder, setLastReorder] = useState(null);

  const handleReorder = useCallback((itemId, from, to) => {
    const newItems = [...items];
    const [movedItem] = newItems.splice(from, 1);
    newItems.splice(to, 0, movedItem);
    
    setItems(newItems);
    setLastReorder({ itemId, from, to, timestamp: Date.now() });
    
    // Debounced save to prevent too many API calls
    debouncedSave(newItems);
  }, [items]);

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={handleReorder}
      onDragStart={() => setIsReordering(true)}
      onDrop={() => setIsReordering(false)}
    >
      <View style={[
        styles.item,
        isReordering && styles.reorderingMode
      ]}>
        <Text>{item.title}</Text>
        {lastReorder?.itemId === item.id && (
          <Text style={styles.recentlyMoved}>Recently moved</Text>
        )}
      </View>
    </SortableItem>
  );

  return (
    <View style={styles.container}>
      {isReordering && (
        <Text style={styles.reorderingIndicator}>
          Reordering items...
        </Text>
      )}
      <Sortable
        data={items}
        renderItem={renderItem}
        itemHeight={70}
      />
    </View>
  );
}
```

## Auto-scrolling

The Sortable component automatically scrolls when dragging items near the edges:

- **Top edge**: Scrolls up when dragging near the top
- **Bottom edge**: Scrolls down when dragging near the bottom
- **Smooth scrolling**: Uses momentum-based scrolling for natural feel
- **Configurable**: Auto-scroll behavior is built-in and optimized

## Performance Optimization

### Large Lists

For large lists, consider these optimizations:

```tsx
function OptimizedSortableList({ data }) {
  // Memoize render function to prevent unnecessary re-renders
  const renderItem = useCallback(({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <MemoizedItemComponent item={item} />
    </SortableItem>
  ), []);

  return (
    <Sortable
      data={data}
      renderItem={renderItem}
      itemHeight={ITEM_HEIGHT}
      // Use consistent item height for better performance
    />
  );
}

// Memoize item components
const MemoizedItemComponent = React.memo(({ item }) => (
  <View style={styles.item}>
    <Text>{item.title}</Text>
  </View>
));
```

### Memory Management

```tsx
function MemoryEfficientSortable() {
  // Use stable references for callbacks
  const handleMove = useCallback((itemId, from, to) => {
    // Handle reordering
  }, []);

  const handleDragStart = useCallback((itemId) => {
    // Handle drag start
  }, []);

  const renderItem = useCallback(({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={handleMove}
      onDragStart={handleDragStart}
    >
      <ItemComponent item={item} />
    </SortableItem>
  ), [handleMove, handleDragStart]);

  return (
    <Sortable
      data={data}
      renderItem={renderItem}
      itemHeight={ITEM_HEIGHT}
    />
  );
}
```

## TypeScript Support

The Sortable component is fully typed with generic support:

```tsx
interface TaskData {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  assignee?: string;
}

// Fully typed sortable
<Sortable<TaskData>
  data={tasks}
  renderItem={({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      {/* item is fully typed with TaskData properties */}
      <TaskComponent task={item} />
    </SortableItem>
  )}
  itemHeight={80}
/>
```

## Integration with State Management

### Redux Integration

```tsx
function ReduxSortableList() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectTasks);

  const handleReorder = (itemId, from, to) => {
    dispatch(reorderTasks({ itemId, from, to }));
  };

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={handleReorder}
    >
      <TaskItem task={item} />
    </SortableItem>
  );

  return (
    <Sortable
      data={tasks}
      renderItem={renderItem}
      itemHeight={70}
    />
  );
}
```

### Zustand Integration

```tsx
function ZustandSortableList() {
  const { items, reorderItems } = useStore();

  const renderItem = ({ item, id, positions, ...props }) => (
    <SortableItem
      key={id}
      id={id}
      positions={positions}
      {...props}
      onMove={reorderItems}
    >
      <ItemComponent item={item} />
    </SortableItem>
  );

  return (
    <Sortable
      data={items}
      renderItem={renderItem}
      itemHeight={60}
    />
  );
}
```

## Accessibility

The Sortable component supports accessibility features:

```tsx
<Sortable
  data={data}
  renderItem={({ item, id, positions, ...props }) => (
    <SortableItem key={id} id={id} positions={positions} {...props}>
      <View
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Sortable item: ${item.title}`}
        accessibilityHint="Double tap and hold to reorder this item"
        accessibilityActions={[
          { name: 'move-up', label: 'Move up' },
          { name: 'move-down', label: 'Move down' },
        ]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'move-up') {
            // Handle move up
          } else if (event.nativeEvent.actionName === 'move-down') {
            // Handle move down
          }
        }}
      >
        <Text>{item.title}</Text>
      </View>
    </SortableItem>
  )}
  itemHeight={70}
/>
```

## See Also

- [SortableItem](./sortable-item) - Individual sortable item component
- [useSortableList Hook](../hooks/use-sortable-list) - Underlying hook for custom implementations
- [useSortable Hook](../hooks/use-sortable) - Hook for individual sortable items
- [Examples](../examples/sortable-lists) - More comprehensive examples
