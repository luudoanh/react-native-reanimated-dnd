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

  // Shared values for layout properties
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const itemW = useSharedValue(0);
  const itemH = useSharedValue(0);
  const isOriginSet = useRef(false); // Remains a JS ref, used only in handleLayout

  const animatedViewRef = useRef<Animated.View>(null);

  useEffect(() => {
    dragDisabledShared.value = dragDisabled;
  }, [dragDisabled, dragDisabledShared]);

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
        // This runs on the JS thread
        if (!isOriginSet.current) {
          originX.value = pageX;
          originY.value = pageY;
          isOriginSet.current = true;
        }
        itemW.value = widthMeasure;
        itemH.value = heightMeasure;
      }
    );
  };

  const { getSlots, setActiveHoverSlot, activeHoverSlotId } = useContext(
    SlotsContext
  ) as SlotsContextValue<TData>;

  const processDropAndAnimate = useCallback(
    (
      currentTx: number,
      currentTy: number,
      draggableData: TData,
      // Layout values passed from worklet
      currentOriginX: number,
      currentOriginY: number,
      currentItemW: number,
      currentItemH: number
    ) => {
      const slots = getSlots();
      const halfWidth = currentItemW / 2;
      const halfHeight = currentItemH / 2;
      const centerX = currentOriginX + currentTx + halfWidth;
      const centerY = currentOriginY + currentTy + halfHeight;

      let hit: DropSlot<TData> | null = null;
      let hitSlotId: number | null = null;

      for (const key in slots) {
        const slotId = parseInt(key, 10);
        const s = slots[slotId];
        if (
          centerX >= s.x &&
          centerX <= s.x + s.width &&
          centerY >= s.y &&
          centerY <= s.y + s.height
        ) {
          hit = s;
          hitSlotId = slotId;
          break;
        }
      }

      if (hit && hitSlotId !== null) {
        if (hit.onDrop) {
          hit.onDrop(draggableData);
        }
        const slotCenterX = hit.x + hit.width / 2;
        const slotCenterY = hit.y + hit.height / 2;

        const draggableTargetX = slotCenterX - currentItemW / 2;
        const draggableTargetY = slotCenterY - currentItemH / 2;

        runOnUI(animateToPositionWorklet)(
          tx,
          ty,
          draggableTargetX - currentOriginX,
          draggableTargetY - currentOriginY
        );
      } else {
        runOnUI(animateToPositionWorklet)(tx, ty, 0, 0);
      }
    },
    [getSlots, tx, ty] // tx, ty are stable shared value objects
  );

  const updateHoverState = useCallback(
    (
      currentTxVal: number,
      currentTyVal: number,
      // Layout values passed from worklet
      currentOriginX: number,
      currentOriginY: number,
      currentItemW: number,
      currentItemH: number
    ) => {
      const slots = getSlots();
      const halfWidth = currentItemW / 2;
      const halfHeight = currentItemH / 2;
      const centerX = currentOriginX + currentTxVal + halfWidth;
      const centerY = currentOriginY + currentTyVal + halfHeight;

      let newHoveredSlotId: number | null = null;
      for (const key in slots) {
        const slotId = parseInt(key, 10);
        const s = slots[slotId];
        if (
          centerX >= s.x &&
          centerX <= s.x + s.width &&
          centerY >= s.y &&
          centerY <= s.y + s.height
        ) {
          newHoveredSlotId = slotId;
          break;
        }
      }

      if (activeHoverSlotId !== newHoveredSlotId) {
        setActiveHoverSlot(newHoveredSlotId);
      }
    },
    [getSlots, setActiveHoverSlot, activeHoverSlotId]
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

          runOnJS(updateHoverState)(
            tx.value,
            ty.value,
            originX.value, // Read shared value on UI thread
            originY.value, // Read shared value on UI thread
            itemW.value, // Read shared value on UI thread
            itemH.value // Read shared value on UI thread
          );
        })
        .onEnd(() => {
          "worklet";
          if (dragDisabledShared.value) {
            return;
          }
          if (onDragEnd) {
            runOnJS(onDragEnd)(data);
          }
          runOnJS(processDropAndAnimate)(
            tx.value,
            ty.value,
            data,
            originX.value, // Read shared value on UI thread
            originY.value, // Read shared value on UI thread
            itemW.value, // Read shared value on UI thread
            itemH.value // Read shared value on UI thread
          );
          runOnJS(setActiveHoverSlot)(null);
        }),
    [
      dragDisabledShared,
      offsetX,
      offsetY,
      tx,
      ty,
      originX, // Shared value object
      originY, // Shared value object
      itemW, // Shared value object
      itemH, // Shared value object
      onDragStart,
      onDragEnd,
      data,
      processDropAndAnimate,
      updateHoverState,
      setActiveHoverSlot,
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
