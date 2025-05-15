// hooks/useDraggable.ts
import React, { useRef, useCallback, useContext, useEffect } from "react";
import { LayoutChangeEvent } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  runOnUI,
} from "react-native-reanimated";
import {
  Gesture,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import {
  DropSlot,
  SlotsContext,
  SlotsContextValue,
} from "../context/DropContext";

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

export interface UseDraggableOptions<TData = unknown> {
  data: TData;
  dragDisabled?: boolean;
  onDragStart?: (data: TData) => void;
  onDragEnd?: (data: TData) => void;
}

export const useDraggable = <TData = unknown>(
  options: UseDraggableOptions<TData>,
  animatedViewRef: React.RefObject<Animated.View>
) => {
  const { data, dragDisabled = false, onDragStart, onDragEnd } = options;

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
    (_event: LayoutChangeEvent) => {
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

  const processDropAndAnimate = useCallback(
    (
      currentTx: number,
      currentTy: number,
      draggableData: TData,
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
    [getSlots, tx, ty]
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

  const gesture = React.useMemo(
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
            tx.value,
            ty.value,
            data,
            originX.value,
            originY.value,
            itemW.value,
            itemH.value
          );
          runOnJS(setActiveHoverSlot)(null);
        }),
    [
      dragDisabledShared,
      offsetX,
      offsetY,
      tx,
      ty,
      originX,
      originY,
      itemW,
      itemH,
      onDragStart,
      onDragEnd,
      data,
      processDropAndAnimate,
      updateHoverState,
      setActiveHoverSlot,
    ]
  );

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  return { gesture, style, onLayoutHandler: handleLayoutHandler };
};
