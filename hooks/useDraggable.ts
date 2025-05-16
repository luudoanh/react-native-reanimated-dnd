// hooks/useDraggable.ts
import React, { useRef, useCallback, useContext, useEffect } from "react";
import { LayoutChangeEvent, ViewStyle, View } from "react-native";
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
  SlotsContext,
  SlotsContextValue,
  DropAlignment,
  DropOffset,
  DropSlot,
} from "../context/DropContext";

// Type for the custom animation function
export type AnimationFunction = (toValue: number) => number;

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
  animationFunction?: AnimationFunction;
  dragBoundsRef?: React.RefObject<Animated.View | View>;
  dragAxis?: "x" | "y" | "both";
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
    animationFunction,
    dragBoundsRef,
    dragAxis = "both",
  } = options;

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const dragDisabledShared = useSharedValue(dragDisabled);
  const dragAxisShared = useSharedValue(dragAxis);

  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const itemW = useSharedValue(0);
  const itemH = useSharedValue(0);
  const isOriginSet = useRef(false);
  const instanceId = useRef(
    `draggable-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  const boundsX = useSharedValue(0);
  const boundsY = useSharedValue(0);
  const boundsWidth = useSharedValue(0);
  const boundsHeight = useSharedValue(0);
  const boundsAreSet = useSharedValue(false);

  const {
    getSlots,
    setActiveHoverSlot,
    activeHoverSlotId,
    registerPositionUpdateListener,
    unregisterPositionUpdateListener,
  } = useContext(SlotsContext) as SlotsContextValue<TData>;

  useEffect(() => {
    dragDisabledShared.value = dragDisabled;
  }, [dragDisabled, dragDisabledShared]);

  useEffect(() => {
    dragAxisShared.value = dragAxis;
  }, [dragAxis, dragAxisShared]);

  const updateDraggablePosition = useCallback(() => {
    if (!animatedViewRef.current) return;
    const currentTx = tx.value;
    const currentTy = ty.value;
    animatedViewRef.current.measure(
      (
        _x: number,
        _y: number,
        widthMeasure: number,
        heightMeasure: number,
        pageX: number,
        pageY: number
      ) => {
        const newOriginX = pageX - currentTx;
        const newOriginY = pageY - currentTy;
        originX.value = newOriginX;
        originY.value = newOriginY;
        itemW.value = widthMeasure;
        itemH.value = heightMeasure;
        if (!isOriginSet.current) {
          isOriginSet.current = true;
        }
      }
    );
  }, [animatedViewRef, originX, originY, itemW, itemH, tx, ty]);

  const updateBounds = useCallback(() => {
    const currentBoundsView = dragBoundsRef?.current;
    if (currentBoundsView) {
      currentBoundsView.measure((_x, _y, width, height, pageX, pageY) => {
        if (
          typeof pageX === "number" &&
          typeof pageY === "number" &&
          width > 0 &&
          height > 0
        ) {
          runOnUI(() => {
            "worklet";
            boundsX.value = pageX;
            boundsY.value = pageY;
            boundsWidth.value = width;
            boundsHeight.value = height;
            if (!boundsAreSet.value) {
              boundsAreSet.value = true;
            }
          })();
        } else {
          console.warn(
            "useDraggable: dragBoundsRef measurement failed or returned invalid dimensions. Bounds may be stale or item unbounded."
          );
        }
      });
    } else {
      runOnUI(() => {
        "worklet";
        if (boundsAreSet.value) {
          boundsAreSet.value = false;
        }
      })();
    }
  }, [
    dragBoundsRef,
    boundsX,
    boundsY,
    boundsWidth,
    boundsHeight,
    boundsAreSet,
  ]);

  useEffect(() => {
    const handlePositionUpdate = () => {
      updateDraggablePosition();
      updateBounds();
    };
    registerPositionUpdateListener(instanceId, handlePositionUpdate);
    return () => {
      unregisterPositionUpdateListener(instanceId);
    };
  }, [
    instanceId,
    registerPositionUpdateListener,
    unregisterPositionUpdateListener,
    updateDraggablePosition,
    updateBounds,
  ]);

  useEffect(() => {
    updateBounds();
  }, [updateBounds]);

  const handleLayoutHandler = useCallback(
    (event: LayoutChangeEvent) => {
      updateDraggablePosition();
    },
    [updateDraggablePosition]
  );

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
    [animationFunction, tx, ty]
  );

  const processDropAndAnimate = useCallback(
    (
      currentTxVal: number,
      currentTyVal: number,
      draggableData: TData,
      currentOriginX: number,
      currentOriginY: number,
      currentItemW: number,
      currentItemH: number
    ) => {
      const slots = getSlots();
      const halfWidth = currentItemW / 2;
      const halfHeight = currentItemH / 2;
      const currentDraggableCenterX = currentOriginX + currentTxVal + halfWidth;
      const currentDraggableCenterY =
        currentOriginY + currentTyVal + halfHeight;

      let hitSlotData: DropSlot<TData> | null = null;
      let hitSlotId: number | null = null;

      for (const key in slots) {
        const slotId = parseInt(key, 10);
        const s = slots[slotId];
        if (
          currentDraggableCenterX >= s.x &&
          currentDraggableCenterX <= s.x + s.width &&
          currentDraggableCenterY >= s.y &&
          currentDraggableCenterY <= s.y + s.height
        ) {
          hitSlotData = s;
          hitSlotId = slotId;
          break;
        }
      }

      let finalTxValue: number;
      let finalTyValue: number;

      if (hitSlotData && hitSlotId !== null) {
        if (hitSlotData.onDrop) {
          runOnJS(hitSlotData.onDrop)(draggableData);
        }
        const alignment: DropAlignment = hitSlotData.dropAlignment || "center";
        const offset: DropOffset = hitSlotData.dropOffset || { x: 0, y: 0 };
        let targetX = 0;
        let targetY = 0;
        switch (alignment) {
          case "top-left":
            targetX = hitSlotData.x;
            targetY = hitSlotData.y;
            break;
          case "top-center":
            targetX = hitSlotData.x + hitSlotData.width / 2 - currentItemW / 2;
            targetY = hitSlotData.y;
            break;
          case "top-right":
            targetX = hitSlotData.x + hitSlotData.width - currentItemW;
            targetY = hitSlotData.y;
            break;
          case "center-left":
            targetX = hitSlotData.x;
            targetY = hitSlotData.y + hitSlotData.height / 2 - currentItemH / 2;
            break;
          case "center":
            targetX = hitSlotData.x + hitSlotData.width / 2 - currentItemW / 2;
            targetY = hitSlotData.y + hitSlotData.height / 2 - currentItemH / 2;
            break;
          case "center-right":
            targetX = hitSlotData.x + hitSlotData.width - currentItemW;
            targetY = hitSlotData.y + hitSlotData.height / 2 - currentItemH / 2;
            break;
          case "bottom-left":
            targetX = hitSlotData.x;
            targetY = hitSlotData.y + hitSlotData.height - currentItemH;
            break;
          case "bottom-center":
            targetX = hitSlotData.x + hitSlotData.width / 2 - currentItemW / 2;
            targetY = hitSlotData.y + hitSlotData.height - currentItemH;
            break;
          case "bottom-right":
            targetX = hitSlotData.x + hitSlotData.width - currentItemW;
            targetY = hitSlotData.y + hitSlotData.height - currentItemH;
            break;
          default:
            targetX = hitSlotData.x + hitSlotData.width / 2 - currentItemW / 2;
            targetY = hitSlotData.y + hitSlotData.height / 2 - currentItemH / 2;
        }
        const draggableTargetX = targetX + offset.x;
        const draggableTargetY = targetY + offset.y;
        finalTxValue = draggableTargetX - currentOriginX;
        finalTyValue = draggableTargetY - currentOriginY;
      } else {
        finalTxValue = 0;
        finalTyValue = 0;
      }
      runOnUI(animateDragEndPosition)(finalTxValue, finalTyValue);
    },
    [getSlots, animateDragEndPosition]
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
          let newTx = offsetX.value + event.translationX;
          let newTy = offsetY.value + event.translationY;
          if (boundsAreSet.value) {
            const currentItemW = itemW.value;
            const currentItemH = itemH.value;
            const minTx = boundsX.value - originX.value;
            const maxTx =
              boundsX.value + boundsWidth.value - originX.value - currentItemW;
            const minTy = boundsY.value - originY.value;
            const maxTy =
              boundsY.value + boundsHeight.value - originY.value - currentItemH;
            newTx = Math.max(minTx, Math.min(newTx, maxTx));
            newTy = Math.max(minTy, Math.min(newTy, maxTy));
          }
          if (dragAxisShared.value === "x") {
            tx.value = newTx;
          } else if (dragAxisShared.value === "y") {
            ty.value = newTy;
          } else {
            tx.value = newTx;
            ty.value = newTy;
          }
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
      animationFunction,
      onDragging,
      boundsAreSet,
      boundsX,
      boundsY,
      boundsWidth,
      boundsHeight,
      dragAxisShared,
    ]
  );

  const animatedStyleProp = useAnimatedStyle(() => {
    "worklet";
    return {
      transform: [{ translateX: tx.value }, { translateY: ty.value }],
    };
  }, [tx, ty]);

  return {
    animatedViewProps: {
      style: animatedStyleProp,
      onLayout: handleLayoutHandler,
    },
    gesture,
  };
};
