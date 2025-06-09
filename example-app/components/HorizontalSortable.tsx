import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { DropProvider } from "../context/DropContext";
import {
  HorizontalSortableProps,
  HorizontalSortableRenderItemProps,
  UseHorizontalSortableListOptions,
  UseHorizontalSortableListReturn,
} from "../types/sortable";
import { useHorizontalSortableList } from "../hooks/useHorizontalSortableList";

// Create an animated version of the ScrollView
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

/**
 * A high-level component for creating horizontal sortable lists with smooth reordering animations.
 *
 * The HorizontalSortable component provides a complete solution for horizontal sortable lists, handling
 * all the complex state management, gesture handling, gap management, and animations internally.
 * It renders a horizontally scrollable list where items can be dragged to reorder them with
 * smooth animations and auto-scrolling support.
 *
 * @template TData - The type of data items in the list (must extend `{ id: string }`)
 * @param props - Configuration props for the horizontal sortable list
 *
 * @example
 * Basic horizontal sortable list:
 * ```typescript
 * import { HorizontalSortable } from './components/HorizontalSortable';
 *
 * interface Tag {
 *   id: string;
 *   label: string;
 *   color: string;
 * }
 *
 * function TagList() {
 *   const [tags, setTags] = useState<Tag[]>([
 *     { id: '1', label: 'React', color: '#61dafb' },
 *     { id: '2', label: 'TypeScript', color: '#3178c6' },
 *     { id: '3', label: 'React Native', color: '#0fa5e9' }
 *   ]);
 *
 *   const renderTag = ({ item, id, positions, ...props }) => (
 *     <HorizontalSortableItem key={id} id={id} positions={positions} {...props}>
 *       <View style={[styles.tagItem, { backgroundColor: item.color }]}>
 *         <Text style={styles.tagText}>{item.label}</Text>
 *       </View>
 *     </HorizontalSortableItem>
 *   );
 *
 *   return (
 *     <HorizontalSortable
 *       data={tags}
 *       renderItem={renderTag}
 *       itemWidth={120}
 *       gap={10}
 *       paddingHorizontal={16}
 *       style={styles.list}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * Horizontal sortable list with custom styling and callbacks:
 * ```typescript
 * function AdvancedTagList() {
 *   const [tags, setTags] = useState(initialTags);
 *
 *   const renderTag = ({ item, id, positions, ...props }) => (
 *     <HorizontalSortableItem
 *       key={id}
 *       id={id}
 *       positions={positions}
 *       {...props}
 *       onMove={(itemId, from, to) => {
 *         // Update data when items are reordered
 *         const newTags = [...tags];
 *         const [movedTag] = newTags.splice(from, 1);
 *         newTags.splice(to, 0, movedTag);
 *         setTags(newTags);
 *
 *         // Analytics
 *         analytics.track('tag_reordered', { tagId: itemId, from, to });
 *       }}
 *       onDragStart={(itemId) => {
 *         hapticFeedback();
 *         setDraggingTag(itemId);
 *       }}
 *       onDrop={(itemId) => {
 *         setDraggingTag(null);
 *       }}
 *     >
 *       <Animated.View style={[styles.tagItem, item.priority === 'high' && styles.highPriority]}>
 *         <Text style={styles.tagLabel}>{item.label}</Text>
 *         <Text style={styles.tagCategory}>{item.category}</Text>
 *         <View style={styles.dragHandle}>
 *           <Icon name="drag-handle" size={16} color="#666" />
 *         </View>
 *       </Animated.View>
 *     </HorizontalSortableItem>
 *   );
 *
 *   return (
 *     <View style={styles.container}>
 *       <Text style={styles.header}>My Tags ({tags.length})</Text>
 *       <HorizontalSortable
 *         data={tags}
 *         renderItem={renderTag}
 *         itemWidth={140}
 *         gap={12}
 *         paddingHorizontal={20}
 *         style={styles.sortableList}
 *         contentContainerStyle={styles.listContent}
 *       />
 *     </View>
 *   );
 * }
 * ```
 *
 * @example
 * Horizontal sortable list with drag handles:
 * ```typescript
 * function SortableWithHandles() {
 *   const [items, setItems] = useState(data);
 *
 *   const renderItem = ({ item, id, positions, ...props }) => (
 *     <HorizontalSortableItem key={id} id={id} positions={positions} {...props}>
 *       <View style={styles.itemContainer}>
 *         <View style={styles.itemContent}>
 *           <Text style={styles.itemTitle}>{item.title}</Text>
 *           <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
 *         </View>
 *
 *         {/* Only this handle area can initiate dragging *\/}
 *         <HorizontalSortableItem.Handle style={styles.dragHandle}>
 *           <View style={styles.handleIcon}>
 *             <View style={styles.handleDot} />
 *             <View style={styles.handleDot} />
 *             <View style={styles.handleDot} />
 *           </View>
 *         </HorizontalSortableItem.Handle>
 *       </View>
 *     </HorizontalSortableItem>
 *   );
 *
 *   return (
 *     <HorizontalSortable
 *       data={items}
 *       renderItem={renderItem}
 *       itemWidth={160}
 *       gap={8}
 *       paddingHorizontal={16}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * Horizontal sortable list with custom key extractor:
 * ```typescript
 * interface CustomItem {
 *   uuid: string;
 *   name: string;
 *   order: number;
 * }
 *
 * function CustomHorizontalSortableList() {
 *   const [items, setItems] = useState<CustomItem[]>(data);
 *
 *   const renderItem = ({ item, id, positions, ...props }) => (
 *     <HorizontalSortableItem key={id} id={id} positions={positions} {...props}>
 *       <View style={styles.customItem}>
 *         <Text>{item.name}</Text>
 *         <Text>Order: {item.order}</Text>
 *       </View>
 *     </HorizontalSortableItem>
 *   );
 *
 *   return (
 *     <HorizontalSortable
 *       data={items}
 *       renderItem={renderItem}
 *       itemWidth={100}
 *       gap={6}
 *       itemKeyExtractor={(item) => item.uuid} // Use uuid instead of id
 *     />
 *   );
 * }
 * ```
 *
 * @see {@link HorizontalSortableItem} for individual item component
 * @see {@link useHorizontalSortableList} for the underlying hook
 * @see {@link HorizontalSortableRenderItemProps} for render function props
 * @see {@link UseHorizontalSortableListOptions} for configuration options
 * @see {@link UseHorizontalSortableListReturn} for hook return details
 * @see {@link DropProvider} for drag-and-drop context
 */
export function HorizontalSortable<TData extends { id: string }>({
  data,
  renderItem,
  itemWidth,
  gap = 0,
  paddingHorizontal = 0,
  style,
  contentContainerStyle,
  itemKeyExtractor = (item) => item.id,
}: HorizontalSortableProps<TData>) {
  const sortableOptions: UseHorizontalSortableListOptions<TData> = {
    data,
    itemWidth,
    gap,
    paddingHorizontal,
    itemKeyExtractor,
  };

  const {
    scrollViewRef,
    dropProviderRef,
    handleScroll,
    handleScrollEnd,
    contentWidth,
    getItemProps,
  } = useHorizontalSortableList<TData>(sortableOptions);

  return (
    <GestureHandlerRootView style={styles.flex}>
      <DropProvider ref={dropProviderRef}>
        <AnimatedScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          horizontal={true}
          style={[styles.scrollView, style]}
          contentContainerStyle={[
            { width: contentWidth },
            contentContainerStyle,
          ]}
          onScrollEndDrag={handleScrollEnd}
          onMomentumScrollEnd={handleScrollEnd}
          simultaneousHandlers={dropProviderRef}
          showsHorizontalScrollIndicator={false}
          bounces={false}
        >
          {data.map((item, index) => {
            // Get the item props from our hook
            const itemProps = getItemProps(item, index);

            // Create the complete props with the item and index
            const sortableItemProps: HorizontalSortableRenderItemProps<TData> =
              {
                item,
                index,
                ...itemProps,
              };

            return renderItem(sortableItemProps);
          })}
        </AnimatedScrollView>
      </DropProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    position: "relative",
    backgroundColor: "transparent",
  },
});
