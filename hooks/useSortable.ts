import { useState, useRef, useEffect } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandlerGestureEvent } from "react-native-gesture-handler";
import {
  setPosition,
  setAutoScroll,
  ScrollDirection,
} from "../components/sortableUtils";

export interface UseSortableOptions<T> {
  id: string;
  positions: SharedValue<{ [id: string]: number }>;
  lowerBound: SharedValue<number>;
  autoScrollDirection: SharedValue<ScrollDirection>;
  itemsCount: number;
  itemHeight: number;
  containerHeight?: number;
  onMove?: (id: string, from: number, to: number) => void;
  onDragStart?: (id: string, position: number) => void;
  onDrop?: (id: string, position: number) => void;
  onDragging?: (
    id: string,
    overItemId: string | null,
    yPosition: number
  ) => void;
}

export interface UseSortableReturn {
  animatedStyle: StyleProp<ViewStyle>;
  panGestureHandler: any;
  isMoving: boolean;
}

export function useSortable<T>(
  options: UseSortableOptions<T>
): UseSortableReturn {
  const {
    id,
    positions,
    lowerBound,
    autoScrollDirection,
    itemsCount,
    itemHeight,
    containerHeight = 500,
    onMove,
    onDragStart,
    onDrop,
    onDragging,
  } = options;

  const [isMoving, setIsMoving] = useState(false);
  const movingSV = useSharedValue(false);
  const currentOverItemId = useSharedValue<string | null>(null);
  const onDraggingLastCallTimestamp = useSharedValue(0);
  const THROTTLE_INTERVAL = 50; // milliseconds

  const positionY = useSharedValue(0);
  const top = useSharedValue(0);
  const targetLowerBound = useSharedValue(0);

  useEffect(() => {
    runOnUI(() => {
      "worklet";
      const initialTopVal = positions.value[id] * itemHeight;
      const initialLowerBoundVal = lowerBound.value;
      top.value = initialTopVal;
      positionY.value = initialTopVal;
      targetLowerBound.value = initialLowerBoundVal;
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculatedContainerHeight = useRef(containerHeight).current;
  const upperBound = useDerivedValue(
    () => lowerBound.value + calculatedContainerHeight
  );

  useAnimatedReaction(
    () => positionY.value,
    (currentY, previousY) => {
      if (currentY === null || !movingSV.value) {
        return;
      }

      if (previousY !== null && currentY === previousY) {
        return;
      }

      // Calculate target discrete position
      const clampedPosition = Math.min(
        Math.max(0, Math.ceil(currentY / itemHeight)),
        itemsCount - 1
      );

      // Determine overItemId based on the current state of positions.value
      // BEFORE setPosition modifies it for this specific currentY
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
          runOnJS(onDragging)(id, newOverItemId, Math.round(currentY));
          onDraggingLastCallTimestamp.value = now;
        }
      }

      // Update visual position and logical positions
      top.value = currentY;
      setPosition(currentY, itemsCount, positions, id, itemHeight);
      setAutoScroll(
        currentY,
        lowerBound.value,
        upperBound.value,
        itemHeight,
        autoScrollDirection
      );
    },
    [
      movingSV,
      itemHeight,
      itemsCount,
      positions,
      id,
      onDragging,
      lowerBound,
      upperBound,
      autoScrollDirection,
      currentOverItemId,
      top,
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
          top.value = withSpring(currentPosition * itemHeight);
          if (onMove) {
            runOnJS(onMove)(id, previousPosition, currentPosition);
          }
        }
      }
    },
    [movingSV]
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
          case ScrollDirection.Up: {
            targetLowerBound.value = lowerBound.value;
            targetLowerBound.value = withTiming(0, { duration: 1500 });
            break;
          }
          case ScrollDirection.Down: {
            const contentHeight = itemsCount * itemHeight;
            const maxScroll = contentHeight - calculatedContainerHeight;
            targetLowerBound.value = lowerBound.value;
            targetLowerBound.value = withTiming(maxScroll, { duration: 1500 });
            break;
          }
          case ScrollDirection.None: {
            targetLowerBound.value = lowerBound.value;
            break;
          }
        }
      }
    }
  );

  useAnimatedReaction(
    () => targetLowerBound.value,
    (targetLowerBoundValue, previousValue) => {
      if (
        targetLowerBoundValue !== null &&
        previousValue !== null &&
        targetLowerBoundValue !== previousValue
      ) {
        if (movingSV.value) {
          lowerBound.value = targetLowerBoundValue;
        }
      }
    },
    [movingSV]
  );

  type GestureContext = Record<string, number>;

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart(event, ctx) {
      "worklet";
      ctx.initialItemContentY = positions.value[id] * itemHeight;
      ctx.initialFingerAbsoluteY = event.absoluteY;
      ctx.initialLowerBound = lowerBound.value;

      positionY.value = ctx.initialItemContentY;
      movingSV.value = true;
      runOnJS(setIsMoving)(true);

      if (onDragStart) {
        runOnJS(onDragStart)(id, positions.value[id]);
      }
    },
    onActive(event, ctx) {
      "worklet";
      const fingerDyScreen = event.absoluteY - ctx.initialFingerAbsoluteY;
      const scrollDeltaSinceStart = lowerBound.value - ctx.initialLowerBound;
      positionY.value =
        ctx.initialItemContentY + fingerDyScreen + scrollDeltaSinceStart;
    },
    onFinish() {
      "worklet";
      const finishPosition = positions.value[id] * itemHeight;
      top.value = withTiming(finishPosition);
      movingSV.value = false;
      runOnJS(setIsMoving)(false);

      if (onDrop) {
        runOnJS(onDrop)(id, positions.value[id]);
      }

      currentOverItemId.value = null;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    "worklet";
    return {
      position: "absolute",
      left: 0,
      right: 0,
      top: top.value,
      zIndex: movingSV.value ? 1 : 0,
      backgroundColor: "#000000",
      shadowColor: "black",
      shadowOpacity: withSpring(movingSV.value ? 0.2 : 0),
      shadowRadius: 10,
    };
  }, [movingSV]);

  return {
    animatedStyle,
    panGestureHandler,
    isMoving,
  };
}
