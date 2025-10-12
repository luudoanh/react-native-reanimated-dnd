import React, { useEffect, useMemo, useRef, useState } from "react";
import { Gesture } from "react-native-gesture-handler";
import {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import {
  getContentWidth,
  getItemXPosition,
  setHorizontalAutoScroll,
  setHorizontalPosition,
} from "../components/sortableUtils";
import {
  HorizontalScrollDirection,
  UseHorizontalSortableOptions,
  UseHorizontalSortableReturn,
} from "../types/sortable";

/**
 * A hook for creating horizontal sortable list items with drag-and-drop reordering capabilities.
 *
 * This hook provides the core functionality for individual items within a horizontal sortable list,
 * handling drag gestures, position animations, auto-scrolling, and reordering logic.
 * It works in conjunction with useHorizontalSortableList to provide a complete horizontal sortable solution.
 *
 * @template T - The type of data associated with the sortable item
 * @param options - Configuration options for the horizontal sortable item behavior
 * @returns Object containing animated styles, gesture handlers, and state for the horizontal sortable item
 *
 * @example
 * Basic horizontal sortable item:
 * ```typescript
 * import { useHorizontalSortable } from './hooks/useHorizontalSortable';
 *
 * function SortableTagItem({ tag, positions, ...sortableProps }) {
 *   const { animatedStyle, panGestureHandler, isMoving } = useHorizontalSortable({
 *     id: tag.id,
 *     positions,
 *     ...sortableProps,
 *     onMove: (id, from, to) => {
 *       console.log(`Tag ${id} moved from ${from} to ${to}`);
 *       reorderTags(id, from, to);
 *     }
 *   });
 *
 *   return (
 *     <PanGestureHandler {...panGestureHandler}>
 *       <Animated.View style={[styles.tagItem, animatedStyle]}>
 *         <Text style={[styles.tagText, isMoving && styles.dragging]}>
 *           {tag.label}
 *         </Text>
 *       </Animated.View>
 *     </PanGestureHandler>
 *   );
 * }
 * ```
 *
 * @example
 * Horizontal sortable item with drag handle:
 * ```typescript
 * import { useHorizontalSortable } from './hooks/useHorizontalSortable';
 * import { SortableHandle } from './components/HorizontalSortableItem';
 *
 * function TagWithHandle({ tag, ...sortableProps }) {
 *   const { animatedStyle, panGestureHandler, hasHandle } = useHorizontalSortable({
 *     id: tag.id,
 *     ...sortableProps,
 *     children: (
 *       <View style={styles.tagContent}>
 *         <Text>{tag.label}</Text>
 *         <SortableHandle>
 *           <Icon name="drag-handle" />
 *         </SortableHandle>
 *       </View>
 *     )
 *   });
 *
 *   return (
 *     <PanGestureHandler {...panGestureHandler}>
 *       <Animated.View style={[styles.tagItem, animatedStyle]}>
 *         <View style={styles.tagContent}>
 *           <Text>{tag.label}</Text>
 *           <SortableHandle>
 *             <Icon name="drag-handle" />
 *           </SortableHandle>
 *         </View>
 *       </Animated.View>
 *     </PanGestureHandler>
 *   );
 * }
 * ```
 *
 * @example
 * Horizontal sortable item with callbacks and state tracking:
 * ```typescript
 * function AdvancedHorizontalSortableItem({ item, ...sortableProps }) {
 *   const [isDragging, setIsDragging] = useState(false);
 *
 *   const { animatedStyle, panGestureHandler } = useHorizontalSortable({
 *     id: item.id,
 *     ...sortableProps,
 *     onDragStart: (id, position) => {
 *       setIsDragging(true);
 *       analytics.track('horizontal_drag_start', { itemId: id, position });
 *     },
 *     onDrop: (id, position) => {
 *       setIsDragging(false);
 *       analytics.track('horizontal_drag_end', { itemId: id, position });
 *     },
 *     onDragging: (id, overItemId, xPosition) => {
 *       if (overItemId) {
 *         showHorizontalDropPreview(overItemId);
 *       }
 *     }
 *   });
 *
 *   return (
 *     <PanGestureHandler {...panGestureHandler}>
 *       <Animated.View
 *         style={[
 *           styles.item,
 *           animatedStyle,
 *           isDragging && styles.dragging
 *         ]}
 *       >
 *         <ItemContent item={item} isDragging={isDragging} />
 *       </Animated.View>
 *     </PanGestureHandler>
 *   );
 * }
 * ```
 */
export function useHorizontalSortable<T>(
  options: UseHorizontalSortableOptions<T>
): UseHorizontalSortableReturn {
  const {
    id,
    positions,
    leftBound,
    autoScrollDirection,
    itemsCount,
    itemWidth,
    gap = 0,
    paddingHorizontal = 0,
    containerWidth = 500,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
    children,
    handleComponent,
  } = options;

  const [isMoving, setIsMoving] = useState(false);
  const [hasHandle, setHasHandle] = useState(false);
  const movingSV = useSharedValue(false);
  const currentOverItemId = useSharedValue<string | null>(null);
  const onDraggingLastCallTimestamp = useSharedValue(0);
  const THROTTLE_INTERVAL = 50; // milliseconds

  const initialLeftVal = useMemo(() => {
    const posArr = positions.get();
    const pos = posArr?.[id];
    return getItemXPosition(pos, itemWidth, gap, paddingHorizontal);
  }, []);

  const initialLeftBoundVal = useMemo(() => {
    return leftBound.get();
  }, []);

  const positionX = useSharedValue(initialLeftVal);
  const left = useSharedValue(initialLeftVal);
  const targetLeftBound = useSharedValue(initialLeftBoundVal);
  const dragCtx = useSharedValue({
    initialItemContentX: 0,
    initialFingerAbsoluteX: 0,
    initialLeftBound: 0,
  });

  const calculatedContainerWidth = useRef(containerWidth).current;
  const rightBound = useDerivedValue(
    () => leftBound.value + calculatedContainerWidth
  );

  useEffect(() => {
    if (!children || !handleComponent) {
      setHasHandle(false);
      return;
    }

    const checkForHandle = (child: React.ReactNode): boolean => {
      if (React.isValidElement(child)) {
        if (child.type === handleComponent) {
          return true;
        }

        if (child.props && (child.props as any).children) {
          if (
            React.Children.toArray((child.props as any).children).some(
              checkForHandle
            )
          ) {
            return true;
          }
        }
      }
      return false;
    };

    setHasHandle(React.Children.toArray(children).some(checkForHandle));
  }, [children, handleComponent]);

  useAnimatedReaction(
    () => positionX.value,
    (currentX, previousX) => {
      if (currentX === null || !movingSV.value) {
        return;
      }

      if (previousX !== null && currentX === previousX) {
        return;
      }

      // Calculate target discrete position with gap and padding considerations
      const adjustedX = currentX - paddingHorizontal;
      const itemWithGapWidth = itemWidth + gap;
      const clampedPosition = Math.min(
        Math.max(0, Math.ceil(adjustedX / itemWithGapWidth)),
        itemsCount - 1
      );

      // Determine overItemId based on the current state of positions.value
      // BEFORE setHorizontalPosition modifies it for this specific currentX
      let newOverItemId: string | null = null;
      for (const [itemIdIter, itemPosIter] of Object.entries(positions.value)) {
        if (itemPosIter === clampedPosition && itemIdIter !== id) {
          newOverItemId = itemIdIter;
          break;
        }
      }

      if (currentOverItemId.value !== newOverItemId) {
        currentOverItemId.value = newOverItemId;
      }

      if (onDragging) {
        const now = Date.now();
        if (now - onDraggingLastCallTimestamp.value > THROTTLE_INTERVAL) {
          scheduleOnRN(onDragging, id, newOverItemId, Math.round(currentX));
          onDraggingLastCallTimestamp.value = now;
        }
      }

      // Update visual position and logical positions
      left.value = currentX;
      setHorizontalPosition(
        currentX,
        itemsCount,
        positions,
        id,
        itemWidth,
        gap,
        paddingHorizontal
      );
      setHorizontalAutoScroll(
        currentX,
        leftBound.value,
        rightBound.value,
        itemWidth,
        autoScrollDirection
      );
    },
    [
      movingSV,
      itemWidth,
      gap,
      paddingHorizontal,
      itemsCount,
      positions,
      id,
      onDragging,
      leftBound,
      rightBound,
      autoScrollDirection,
      currentOverItemId,
      left,
      onDraggingLastCallTimestamp,
    ]
  );

  useAnimatedReaction(
    () => positions.value[id],
    (currentPosition, previousPosition) => {
      if (
        currentPosition !== null &&
        previousPosition !== null &&
        currentPosition !== previousPosition
      ) {
        if (!movingSV.value) {
          const newLeft = getItemXPosition(
            currentPosition,
            itemWidth,
            gap,
            paddingHorizontal
          );
          left.value = withSpring(newLeft);
          if (onMove) {
            scheduleOnRN(onMove, id, previousPosition, currentPosition);
          }
        }
      }
    },
    [movingSV, itemWidth, gap, paddingHorizontal]
  );

  useAnimatedReaction(
    () => autoScrollDirection.value,
    (scrollDirection, previousValue) => {
      if (
        scrollDirection !== null &&
        previousValue !== null &&
        scrollDirection !== previousValue
      ) {
        switch (scrollDirection) {
          case HorizontalScrollDirection.Left: {
            targetLeftBound.value = leftBound.value;
            targetLeftBound.value = withTiming(0, { duration: 1500 });
            break;
          }
          case HorizontalScrollDirection.Right: {
            // Use the same content width calculation as in useHorizontalSortableList
            const contentWidth = getContentWidth(
              itemsCount,
              itemWidth,
              gap,
              paddingHorizontal
            );
            const maxScroll = Math.max(
              0,
              contentWidth - calculatedContainerWidth
            );
            targetLeftBound.value = leftBound.value;
            targetLeftBound.value = withTiming(maxScroll, { duration: 1500 });
            break;
          }
          case HorizontalScrollDirection.None: {
            targetLeftBound.value = leftBound.value;
            break;
          }
        }
      }
    }
  );

  useAnimatedReaction(
    () => targetLeftBound.value,
    (targetLeftBoundValue, previousValue) => {
      if (
        targetLeftBoundValue !== null &&
        previousValue !== null &&
        targetLeftBoundValue !== previousValue
      ) {
        if (movingSV.value) {
          leftBound.value = targetLeftBoundValue;
        }
      }
    },
    [movingSV]
  );

  const panGestureHandler = Gesture.Pan()
    .activateAfterLongPress(200)
    .shouldCancelWhenOutside(false)
    .onStart((event) => {
      dragCtx.value = {
        initialItemContentX: getItemXPosition(
          positions.value[id],
          itemWidth,
          gap,
          paddingHorizontal
        ),
        initialFingerAbsoluteX: event.absoluteX,
        initialLeftBound: leftBound.value,
      };

      positionX.value = dragCtx.value.initialItemContentX;
      movingSV.value = true;
      scheduleOnRN(setIsMoving, true);

      if (onDragStart) {
        scheduleOnRN(onDragStart, id, positions.value[id]);
      }
    })
    .onUpdate((event) => {
      const fingerDxScreen =
        event.absoluteX - dragCtx.value.initialFingerAbsoluteX;
      const scrollDeltaSinceStart =
        leftBound.value - dragCtx.value.initialLeftBound;
      positionX.value =
        dragCtx.value.initialItemContentX +
        fingerDxScreen +
        scrollDeltaSinceStart;
    })
    .onFinalize(() => {
      const finishPosition = getItemXPosition(
        positions.value[id],
        itemWidth,
        gap,
        paddingHorizontal
      );
      left.value = withTiming(finishPosition);
      movingSV.value = false;
      scheduleOnRN(setIsMoving, false);

      if (onDrop) {
        const positionsCopy = { ...positions.value };
        scheduleOnRN(onDrop, id, positions.value[id], positionsCopy);
      }

      currentOverItemId.value = null;
    });

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: left.value,
      width: itemWidth,
      zIndex: movingSV.value ? 1 : 0,
      backgroundColor: "transparent",
      shadowColor: "black",
      shadowOpacity: withSpring(movingSV.value ? 0.2 : 0),
      shadowRadius: 10,
    };
  }, [movingSV, itemWidth]);

  return {
    animatedStyle,
    panGestureHandler,
    isMoving,
    hasHandle,
  };
}
