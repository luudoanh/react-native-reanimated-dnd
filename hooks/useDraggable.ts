// hooks/useDraggable.ts
import React, { useRef, useCallback, useContext, useEffect } from "react";
import { LayoutChangeEvent, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  runOnUI,
  AnimatedStyle,
} from "react-native-reanimated";
import {
  Gesture,
  PanGestureHandlerEventPayload,
  GestureType,
} from "react-native-gesture-handler";
import {
  DropSlot,
  SlotsContext,
  SlotsContextValue,
} from "../context/DropContext";

// Type for the custom animation function
// This function itself must be a worklet or compatible with automatic workletization.
export type AnimationFunction = (toValue: number) => number; // number is the typical return for Reanimated animations

export interface UseDraggableOptions<TData = unknown> {
  data: TData;
  dragDisabled?: boolean;
  onDragStart?: (data: TData) => void;
  onDragEnd?: (data: TData) => void;
  onDragging?: (payload: {
    x: number;
    y: number;
    tx: number;
    ty: number;
    itemData: TData;
  }) => void;
  animationFunction?: AnimationFunction; // New option for custom animation
}

export interface UseDraggableReturn {
  animatedViewProps: {
    style: AnimatedStyle<ViewStyle>;
    onLayout: (event: LayoutChangeEvent) => void;
  };
  gesture: GestureType;
}

export const useDraggable = <TData = unknown>(
  options: UseDraggableOptions<TData>,
  animatedViewRef: React.RefObject<Animated.View>
): UseDraggableReturn => {
  const {
    data,
    dragDisabled = false,
    onDragStart,
    onDragEnd,
    onDragging,
    animationFunction, // Captured from options
  } = options;

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const dragDisabledShared = useSharedValue(dragDisabled);

  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const itemW = useSharedValue(0);
  const itemH = useSharedValue(0);
  const isOriginSet = useRef(false);

  useEffect(() => {
    dragDisabledShared.value = dragDisabled;
  }, [dragDisabled, dragDisabledShared]);

  const handleLayoutHandler = useCallback(
    (event: LayoutChangeEvent) => {
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
            originX.value = pageX;
            originY.value = pageY;
            isOriginSet.current = true;
          }
          itemW.value = widthMeasure;
          itemH.value = heightMeasure;
        }
      );
    },
    [animatedViewRef, originX, originY, itemW, itemH, isOriginSet]
  );

  const { getSlots, setActiveHoverSlot, activeHoverSlotId } = useContext(
    SlotsContext
  ) as SlotsContextValue<TData>;

  // New worklet for animating drag end position, captures animationFunction
  const animateDragEndPosition = useCallback(
    (targetXValue: number, targetYValue: number) => {
      "worklet";
      if (animationFunction) {
        tx.value = animationFunction(targetXValue);
        ty.value = animationFunction(targetYValue);
      } else {
        tx.value = withSpring(targetXValue);
        ty.value = withSpring(targetYValue);
      }
    },
    [animationFunction, tx, ty] // Dependencies: animationFunction and the shared values it modifies
  );

  const processDropAndAnimate = useCallback(
    (
      currentTxVal: number, // Renamed to avoid confusion, tx.value at the moment of drop
      currentTyVal: number, // ty.value at the moment of drop
      draggableData: TData,
      currentOriginX: number,
      currentOriginY: number,
      currentItemW: number,
      currentItemH: number
      // animFunc parameter removed
    ) => {
      const slots = getSlots();
      const halfWidth = currentItemW / 2;
      const halfHeight = currentItemH / 2;
      const centerX = currentOriginX + currentTxVal + halfWidth;
      const centerY = currentOriginY + currentTyVal + halfHeight;

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

      let finalTxValue: number;
      let finalTyValue: number;

      if (hit && hitSlotId !== null) {
        if (hit.onDrop) {
          hit.onDrop(draggableData); // Call onDrop on the JS thread
        }
        const slotCenterX = hit.x + hit.width / 2;
        const slotCenterY = hit.y + hit.height / 2;

        const draggableTargetX = slotCenterX - currentItemW / 2;
        const draggableTargetY = slotCenterY - currentItemH / 2;

        finalTxValue = draggableTargetX - currentOriginX;
        finalTyValue = draggableTargetY - currentOriginY;
      } else {
        finalTxValue = 0; // Animate back to origin (0,0 translation)
        finalTyValue = 0;
      }
      // Call the new worklet, which uses the captured animationFunction
      runOnUI(animateDragEndPosition)(finalTxValue, finalTyValue);
    },
    [getSlots, animateDragEndPosition] // Dependency on the new animation worklet
  );

  const updateHoverState = useCallback(
    (
      currentTxVal: number,
      currentTyVal: number,
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

  const gesture = React.useMemo<GestureType>(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          "worklet";
          if (dragDisabledShared.value) return;
          offsetX.value = tx.value;
          offsetY.value = ty.value;
          if (onDragStart) runOnJS(onDragStart)(data);
        })
        .onUpdate((event: PanGestureHandlerEventPayload) => {
          "worklet";
          if (dragDisabledShared.value) return;
          tx.value = offsetX.value + event.translationX;
          ty.value = offsetY.value + event.translationY;
          if (onDragging) {
            runOnJS(onDragging)({
              x: originX.value,
              y: originY.value,
              tx: tx.value,
              ty: ty.value,
              itemData: data,
            });
          }
          runOnJS(updateHoverState)(
            tx.value,
            ty.value,
            originX.value,
            originY.value,
            itemW.value,
            itemH.value
          );
        })
        .onEnd(() => {
          "worklet";
          if (dragDisabledShared.value) return;
          if (onDragEnd) runOnJS(onDragEnd)(data);
          runOnJS(processDropAndAnimate)(
            tx.value, // Pass current translation values
            ty.value,
            data,
            originX.value,
            originY.value,
            itemW.value,
            itemH.value
            // animationFunction argument removed
          );
          runOnJS(setActiveHoverSlot)(null);
        }),
    [
      dragDisabledShared,
      offsetX,
      offsetY,
      tx, // tx, ty are captured by animateDragEndPosition, which is part of processDropAndAnimate's closure indirectly
      ty,
      originX,
      originY,
      itemW,
      itemH,
      onDragStart,
      onDragEnd,
      data,
      processDropAndAnimate, // This now depends on animateDragEndPosition, which depends on animationFunction
      updateHoverState,
      setActiveHoverSlot,
      animationFunction, // Keep animationFunction here, as it affects animateDragEndPosition, which in turn affects processDropAndAnimate
      onDragging,
    ]
  );

  const animatedStyleProp = useAnimatedStyle(
    () => ({
      transform: [{ translateX: tx.value }, { translateY: ty.value }],
    }),
    [tx, ty]
  );

  return {
    animatedViewProps: {
      style: animatedStyleProp,
      onLayout: handleLayoutHandler,
    },
    gesture,
  };
};
