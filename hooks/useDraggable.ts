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
  dragBoundsRef?: React.RefObject<Animated.View | View>; // New option for bounds
  dragAxis?: "x" | "y" | "both"; // New option for drag axis constraint
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
    dragBoundsRef, // Captured from options
    dragAxis = "both", // Default to "both" if not provided
  } = options;

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const dragDisabledShared = useSharedValue(dragDisabled);
  const dragAxisShared = useSharedValue(dragAxis); // Shared value for dragAxis

  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const itemW = useSharedValue(0);
  const itemH = useSharedValue(0);
  const isOriginSet = useRef(false);
  const instanceId = useRef(
    `draggable-${Math.random().toString(36).substr(2, 9)}`
  ).current;

  // Shared values for bounds
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

  // Function to update draggable position
  const updateDraggablePosition = useCallback(() => {
    if (!animatedViewRef.current) return;

    // Capture current translations. These are needed to adjust the new origin.
    // Accessing .value here is fine as this whole callback chain is on the JS thread.
    const currentTx = tx.value;
    const currentTy = ty.value;

    animatedViewRef.current.measure(
      (
        _x: number, // x relative to parent
        _y: number, // y relative to parent
        widthMeasure: number,
        heightMeasure: number,
        pageX: number, // x relative to screen/window
        pageY: number // y relative to screen/window
      ) => {
        // pageX and pageY are the current absolute screen coordinates
        // of the draggable's top-left corner.

        // The new "natural" origin of the draggable (its position if tx/ty were 0)
        // is its current screen position minus its current translation.
        const newOriginX = pageX - currentTx;
        const newOriginY = pageY - currentTy;

        originX.value = newOriginX;
        originY.value = newOriginY;

        itemW.value = widthMeasure;
        itemH.value = heightMeasure;

        // isOriginSet is mostly for the initial setup, but keeping it true
        // indicates that origin calculations have been performed.
        if (!isOriginSet.current) {
          isOriginSet.current = true;
        }
      }
    );
  }, [animatedViewRef, originX, originY, itemW, itemH, tx, ty]); // Added tx, ty to dependencies

  // Update bounds when their ref changes or when position update is requested
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
            // If boundsAreSet was false, and we get a successful measurement, set it to true.
            // If it was already true, it remains true.
            if (!boundsAreSet.value) {
              boundsAreSet.value = true;
            }
          })();
        } else {
          console.warn(
            "useDraggable: dragBoundsRef measurement failed or returned invalid dimensions. Bounds may be stale or item unbounded."
          );
          // Do not change boundsAreSet.value here if a dragBoundsRef exists but measure failed.
          // If it was true, it stays true (using stale values).
          // If it was false (e.g., first attempt failed), it stays false, and item is unbounded.
        }
      });
    } else {
      // No dragBoundsRef provided
      runOnUI(() => {
        "worklet";
        // If boundsAreSet was true (e.g. ref was removed), set it to false.
        // If it was already false, it remains false.
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

  // Register for position updates
  useEffect(() => {
    // Function that will be called when position update is requested
    const handlePositionUpdate = () => {
      updateDraggablePosition();
      updateBounds();
    };

    // Register the position update listener
    registerPositionUpdateListener(instanceId, handlePositionUpdate);

    // Clean up on unmount
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

  // Effect to measure bounds
  useEffect(() => {
    updateBounds();
  }, [updateBounds]);

  const handleLayoutHandler = useCallback(
    (event: LayoutChangeEvent) => {
      updateDraggablePosition();
    },
    [updateDraggablePosition]
  );

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

        // Calculate target based on alignment
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
          case "center": // Default
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
            // Same as center for any unexpected value
            targetX = hitSlotData.x + hitSlotData.width / 2 - currentItemW / 2;
            targetY = hitSlotData.y + hitSlotData.height / 2 - currentItemH / 2;
        }

        // Apply offset
        const draggableTargetX = targetX + offset.x;
        const draggableTargetY = targetY + offset.y;

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

          let newTx = offsetX.value + event.translationX;
          let newTy = offsetY.value + event.translationY;

          if (boundsAreSet.value) {
            const currentItemW = itemW.value;
            const currentItemH = itemH.value;

            // Calculate min/max translation allowed for the draggable's top-left corner
            // based on its own origin (originX, originY) and the bounds
            const minTx = boundsX.value - originX.value;
            const maxTx =
              boundsX.value + boundsWidth.value - originX.value - currentItemW;
            const minTy = boundsY.value - originY.value;
            const maxTy =
              boundsY.value + boundsHeight.value - originY.value - currentItemH;

            newTx = Math.max(minTx, Math.min(newTx, maxTx));
            newTy = Math.max(minTy, Math.min(newTy, maxTy));
          }

          // Apply axis constraints
          if (dragAxisShared.value === "x") {
            tx.value = newTx;
            // ty.value remains unchanged from offsetX/Y or its previous bounded value if bounds were applied before axis constraint
          } else if (dragAxisShared.value === "y") {
            ty.value = newTy;
            // tx.value remains unchanged
          } else {
            // "both" or undefined
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
            tx.value, // Pass current translation values
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
      boundsAreSet,
      boundsX,
      boundsY,
      boundsWidth,
      boundsHeight,
      dragAxisShared, // Add dragAxisShared to dependencies
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
