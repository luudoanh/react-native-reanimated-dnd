import React, { createContext, useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useHorizontalSortable } from "../hooks/useHorizontalSortable";
import {
  HorizontalSortableItemProps,
  SortableHandleProps,
  SortableContextValue,
  UseHorizontalSortableOptions,
} from "../types/sortable";

// Create a context to share gesture between HorizontalSortableItem and SortableHandle
const HorizontalSortableContext = createContext<SortableContextValue | null>(
  null
);

/**
 * A handle component that can be used within HorizontalSortableItem to create a specific
 * draggable area. When a SortableHandle is present, only the handle area can
 * initiate dragging, while the rest of the item remains non-draggable.
 *
 * @param props - Props for the handle component
 *
 * @example
 * Basic drag handle:
 * ```typescript
 * <HorizontalSortableItem id="item-1" {...sortableProps}>
 *   <View style={styles.itemContent}>
 *     <Text>Item content (not draggable)</Text>
 *
 *     <HorizontalSortableItem.Handle style={styles.dragHandle}>
 *       <Icon name="drag-handle" size={20} />
 *     </HorizontalSortableItem.Handle>
 *   </View>
 * </HorizontalSortableItem>
 * ```
 *
 * @example
 * Custom styled handle:
 * ```typescript
 * <HorizontalSortableItem id="item-2" {...sortableProps}>
 *   <View style={styles.card}>
 *     <Text style={styles.title}>Card Title</Text>
 *     <Text style={styles.content}>Card content...</Text>
 *
 *     <HorizontalSortableItem.Handle style={styles.customHandle}>
 *       <View style={styles.handleDots}>
 *         <View style={styles.dot} />
 *         <View style={styles.dot} />
 *         <View style={styles.dot} />
 *       </View>
 *     </HorizontalSortableItem.Handle>
 *   </View>
 * </HorizontalSortableItem>
 * ```
 */
const HorizontalSortableHandle = ({ children, style }: SortableHandleProps) => {
  const sortableContext = useContext(HorizontalSortableContext);

  if (!sortableContext) {
    console.warn(
      "SortableHandle must be used within a HorizontalSortableItem component"
    );
    return <>{children}</>;
  }

  return (
    <PanGestureHandler onGestureEvent={sortableContext.panGestureHandler}>
      <Animated.View style={style}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

/**
 * A component for individual items within a horizontal sortable list.
 *
 * HorizontalSortableItem provides the drag-and-drop functionality for individual list items,
 * handling gesture recognition, position animations, and reordering logic in a horizontal layout.
 * It can be used with or without drag handles for different interaction patterns.
 *
 * @template T - The type of data associated with this sortable item
 * @param props - Configuration props for the horizontal sortable item
 *
 * @example
 * Basic horizontal sortable item (entire item is draggable):
 * ```typescript
 * import { HorizontalSortableItem } from './components/HorizontalSortableItem';
 *
 * function TagItem({ tag, positions, ...sortableProps }) {
 *   return (
 *     <HorizontalSortableItem
 *       id={tag.id}
 *       data={tag}
 *       positions={positions}
 *       {...sortableProps}
 *       onMove={(id, from, to) => {
 *         console.log(`Tag ${id} moved from ${from} to ${to}`);
 *         reorderTags(id, from, to);
 *       }}
 *     >
 *       <View style={styles.tagContainer}>
 *         <Text style={styles.tagText}>{tag.label}</Text>
 *         <Text style={styles.tagCategory}>{tag.category}</Text>
 *       </View>
 *     </HorizontalSortableItem>
 *   );
 * }
 * ```
 *
 * @example
 * Horizontal sortable item with drag handle:
 * ```typescript
 * function TagItemWithHandle({ tag, positions, ...sortableProps }) {
 *   return (
 *     <HorizontalSortableItem
 *       id={tag.id}
 *       data={tag}
 *       positions={positions}
 *       {...sortableProps}
 *     >
 *       <View style={styles.tagContainer}>
 *         <View style={styles.tagContent}>
 *           <Text style={styles.tagText}>{tag.label}</Text>
 *           <Text style={styles.tagDescription}>{tag.description}</Text>
 *         </View>
 *
 *         {/* Only this handle can initiate dragging *\/}
 *         <HorizontalSortableItem.Handle style={styles.dragHandle}>
 *           <View style={styles.handleIcon}>
 *             <View style={styles.handleLine} />
 *             <View style={styles.handleLine} />
 *             <View style={styles.handleLine} />
 *           </View>
 *         </HorizontalSortableItem.Handle>
 *       </View>
 *     </HorizontalSortableItem>
 *   );
 * }
 * ```
 *
 * @example
 * Horizontal sortable item with callbacks and state tracking:
 * ```typescript
 * function AdvancedTagItem({ tag, positions, ...sortableProps }) {
 *   const [isDragging, setIsDragging] = useState(false);
 *
 *   return (
 *     <HorizontalSortableItem
 *       id={tag.id}
 *       data={tag}
 *       positions={positions}
 *       {...sortableProps}
 *       onDragStart={(id, position) => {
 *         setIsDragging(true);
 *         hapticFeedback();
 *         analytics.track('horizontal_drag_start', { tagId: id, position });
 *       }}
 *       onDrop={(id, position) => {
 *         setIsDragging(false);
 *         analytics.track('horizontal_drag_end', { tagId: id, position });
 *       }}
 *       onDragging={(id, overItemId, xPosition) => {
 *         if (overItemId) {
 *           // Show visual feedback for item being hovered over
 *           highlightTag(overItemId);
 *         }
 *       }}
 *       style={[
 *         styles.tagItem,
 *         isDragging && styles.draggingItem
 *       ]}
 *     >
 *       <View style={styles.tagContent}>
 *         <Text style={styles.tagTitle}>{tag.label}</Text>
 *         <Text style={styles.tagColor}>Color: {tag.color}</Text>
 *         {isDragging && (
 *           <Text style={styles.dragIndicator}>Dragging...</Text>
 *         )}
 *       </View>
 *     </HorizontalSortableItem>
 *   );
 * }
 * ```
 *
 * @example
 * Horizontal sortable item with custom animations:
 * ```typescript
 * function AnimatedTagItem({ tag, positions, ...sortableProps }) {
 *   return (
 *     <HorizontalSortableItem
 *       id={tag.id}
 *       data={tag}
 *       positions={positions}
 *       {...sortableProps}
 *       animatedStyle={{
 *         // Custom animated styles can be applied here
 *         shadowOpacity: 0.3,
 *         shadowRadius: 10,
 *         shadowColor: '#000',
 *         shadowOffset: { width: 5, height: 0 }
 *       }}
 *     >
 *       <Animated.View style={[
 *         styles.tagContainer,
 *         {
 *           backgroundColor: tag.priority === 'high' ? '#ffebee' : '#f5f5f5'
 *         }
 *       ]}>
 *         <Text style={styles.tagTitle}>{tag.label}</Text>
 *         <View style={styles.tagMeta}>
 *           <Text style={styles.tagCategory}>{tag.category}</Text>
 *           <Text style={styles.tagCount}>{tag.count}</Text>
 *         </View>
 *       </Animated.View>
 *     </HorizontalSortableItem>
 *   );
 * }
 * ```
 *
 * @see {@link HorizontalSortableItem.Handle} for creating drag handles
 * @see {@link useHorizontalSortable} for the underlying hook
 * @see {@link HorizontalSortable} for the parent sortable list component
 * @see {@link UseHorizontalSortableOptions} for configuration options
 * @see {@link UseHorizontalSortableReturn} for hook return details
 */
export function HorizontalSortableItem<T>({
  id,
  data,
  positions,
  leftBound,
  autoScrollDirection,
  itemsCount,
  itemWidth,
  gap = 0,
  paddingHorizontal = 0,
  containerWidth,
  children,
  style,
  animatedStyle: customAnimatedStyle,
  onMove,
  onDragStart,
  onDrop,
  onDragging,
}: HorizontalSortableItemProps<T>) {
  // Use our custom hook for all the horizontal sortable logic
  const sortableOptions: UseHorizontalSortableOptions<T> = {
    id,
    positions,
    leftBound,
    autoScrollDirection,
    itemsCount,
    itemWidth,
    gap,
    paddingHorizontal,
    containerWidth,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
    children,
    handleComponent: HorizontalSortableHandle,
  };

  const { animatedStyle, panGestureHandler, isMoving, hasHandle } =
    useHorizontalSortable<T>(sortableOptions);

  // Combine the default animated style with any custom styles
  const combinedAnimatedStyle = [animatedStyle, customAnimatedStyle];

  // Create the context value
  const contextValue: SortableContextValue = {
    panGestureHandler,
  };

  // Always provide the context to avoid issues when toggling handle modes
  const content = (
    <Animated.View style={combinedAnimatedStyle}>
      <HorizontalSortableContext.Provider value={contextValue}>
        <Animated.View style={style}>{children}</Animated.View>
      </HorizontalSortableContext.Provider>
    </Animated.View>
  );

  // If a handle is found, let the handle control the dragging
  // Otherwise, the entire component is draggable with PanGestureHandler
  if (hasHandle) {
    return content;
  } else {
    return (
      <PanGestureHandler
        onGestureEvent={panGestureHandler}
        activateAfterLongPress={200}
        shouldCancelWhenOutside={false}
      >
        {content}
      </PanGestureHandler>
    );
  }
}

// Attach the HorizontalSortableHandle as a static property
HorizontalSortableItem.Handle = HorizontalSortableHandle;
