// Node Modules
import React, { useRef, useCallback, useContext, useEffect } from "react";
import { ViewStyle, LayoutChangeEvent, StyleProp, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  runOnUI,
} from "react-native-reanimated";

import { DropSlot, SlotsContext, SlotsContextValue } from "./Droppable";

interface DraggableProps<TData = unknown> {
  data: TData;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  dragDisabled?: boolean;
  onDragStart?: (data: TData) => void;
  onDragEnd?: (data: TData) => void;
}

const animateToPositionWorklet = (
  tx: Animated.SharedValue<number>,
  ty: Animated.SharedValue<number>,
  toX: number,
  toY: number
) => {
  "worklet";
  tx.value = withSpring(toX);
  ty.value = withSpring(toY);
};

export const Draggable = <TData = unknown,>({
  data,
  style,
  children,
  dragDisabled = false,
  onDragStart,
  onDragEnd,
}: DraggableProps<TData>) => {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const dragDisabledShared = useSharedValue(dragDisabled);

  useEffect(() => {
    dragDisabledShared.value = dragDisabled;
  }, [dragDisabled, dragDisabledShared]);

  const origin = useRef({ x: 0, y: 0 });
  const isOriginSet = useRef(false);
  const animatedViewRef = useRef<Animated.View>(null);
  const itemWidth = useRef(0);
  const itemHeight = useRef(0);

  const handleLayout = (_event: LayoutChangeEvent) => {
    animatedViewRef.current?.measure(
      (
        _x: number,
        _y: number,
        widthMeasure: number,
        heightMeasure: number,
        pageX: number,
        pageY: number
      ) => {
        if (!isOriginSet.current) {
          origin.current = { x: pageX, y: pageY };
          isOriginSet.current = true;
        }
        itemWidth.current = widthMeasure;
        itemHeight.current = heightMeasure;
      }
    );
  };

  // Cast is necessary as SlotsContext is SlotsContext<any> by default.
  const slotsContext = useContext(SlotsContext) as SlotsContextValue<TData>;

  const processDropAndAnimate = useCallback(
    (currentTx: number, currentTy: number, draggableData: TData) => {
      const { getSlots } = slotsContext;
      const slots = getSlots();

      const halfWidth = itemWidth.current / 2;
      const halfHeight = itemHeight.current / 2;
      const centerX = origin.current.x + currentTx + halfWidth;
      const centerY = origin.current.y + currentTy + halfHeight;

      let hit: DropSlot<TData> | null = null;
      for (const key in slots) {
        const s = slots[key];
        if (
          centerX >= s.x &&
          centerX <= s.x + s.width &&
          centerY >= s.y &&
          centerY <= s.y + s.height
        ) {
          hit = s;
          break;
        }
      }

      if (hit) {
        if (hit.onDrop) {
          hit.onDrop(draggableData);
        }
        const slotCenterX = hit.x + hit.width / 2;
        const slotCenterY = hit.y + hit.height / 2;

        const draggableTargetX = slotCenterX - itemWidth.current / 2;
        const draggableTargetY = slotCenterY - itemHeight.current / 2;

        runOnUI(animateToPositionWorklet)(
          tx,
          ty,
          draggableTargetX - origin.current.x,
          draggableTargetY - origin.current.y
        );
      } else {
        runOnUI(animateToPositionWorklet)(tx, ty, 0, 0);
      }
    },
    [slotsContext, tx, ty]
  );

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          "worklet";
          if (dragDisabledShared.value) {
            return;
          }
          offsetX.value = tx.value;
          offsetY.value = ty.value;
          if (onDragStart) {
            runOnJS(onDragStart)(data);
          }
        })
        .onUpdate((event: PanGestureHandlerEventPayload) => {
          "worklet";
          if (dragDisabledShared.value) {
            return;
          }
          tx.value = offsetX.value + event.translationX;
          ty.value = offsetY.value + event.translationY;
        })
        .onEnd(() => {
          "worklet";
          if (dragDisabledShared.value) {
            return;
          }
          if (onDragEnd) {
            runOnJS(onDragEnd)(data);
          }
          runOnJS(processDropAndAnimate)(tx.value, ty.value, data);
        }),
    [
      dragDisabledShared,
      offsetX,
      offsetY,
      tx,
      ty,
      onDragStart,
      onDragEnd,
      data,
      processDropAndAnimate,
    ]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        ref={animatedViewRef}
        onLayout={handleLayout}
        style={[style, animatedStyle]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};
